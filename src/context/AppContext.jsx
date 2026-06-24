import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);

  // Fetch real categories, expenses, and profile from Supabase
  const fetchUserData = async (userId) => {
    try {
      // 1. Fetch profile first to determine onboarding status
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.error('Error fetching profile from database:', profileErr);
      } else if (!profileData) {
        setProfile(null);
      } else {
        setProfile(profileData);

      }

      // 2. Fetch categories
      let { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('*');

      if (catErr) {
        console.error('Error fetching categories from database:', catErr);
      }

      // Auto-seed default categories if the table is completely empty
      if (!catErr && (!catData || catData.length === 0)) {
        const defaultCats = [
          { name: 'Food', icon: 'Utensils', color: 'orange', user_id: userId },
          { name: 'Shopping', icon: 'ShoppingBag', color: 'purple', user_id: userId },
          { name: 'Entertainment', icon: 'Play', color: 'indigo', user_id: userId },
          { name: 'Health', icon: 'Activity', color: 'teal', user_id: userId },
          { name: 'Housing', icon: 'Home', color: 'amber', user_id: userId },
          { name: 'Others', icon: 'CreditCard', color: 'slate', user_id: userId }
        ];

        const { data: seedData, error: seedErr } = await supabase
          .from('categories')
          .insert(defaultCats)
          .select();

        if (seedErr) {
          console.error('Error seeding categories into database:', seedErr);
        } else {
          catData = seedData;
        }
      }

      setCategories(catData || []);

      // 3. Fetch expenses and join categories metadata
      const { data: expData, error: expErr } = await supabase
        .from('expenses')
        .select('*, categories(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (expErr) {
        console.error('Error fetching expenses from database:', expErr);
      } else {
        // Map database expenses to local transactions ledger format
        const mappedExpenses = (expData || []).map(exp => ({
          id: exp.id,
          title: exp.description || (exp.categories?.name ? `${exp.categories.name} Purchase` : 'Expense'),
          amount: parseFloat(exp.amount || 0),
          category: exp.categories?.name || 'Others',
          type: 'expense',
          date: exp.created_at
        }));
        setTransactions(mappedExpenses);
      }
    } catch (err) {
      console.error('Unexpected error in database fetch sequence:', err);
    }
  };

  // Helper function to allow manual triggers of state refreshes
  const refreshData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  // Create or update user profile using upsert operation
  const createProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No authenticated user session.' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile in Supabase:', error);
        return { success: false, error };
      }

      setProfile(data);

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error during profile upsert:', err);
      return { success: false, error: err };
    }
  };

  // Update existing profile data using upsert operation
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No authenticated user session.' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile in Supabase:', error);
        return { success: false, error };
      }

      setProfile(data);

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error during profile upsert:', err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    // 1. Fetch initial session on start
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      
      if (activeUser) {
        await fetchUserData(activeUser.id);
      }
      setLoading(false);
    });

    // 2. Setup active auth transition event subscriber
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      
      if (activeUser) {
        await fetchUserData(activeUser.id);
      } else {
        setCategories([]);
        setTransactions([]);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const togglePremium = () => {
    setIsPremium(prev => !prev);
  };

  // Clean user object for header/profile views
  const getExposedUser = () => {
    if (!user) return null;
    const email = user.email || '';
    const displayName = user.user_metadata?.full_name || 
      email.split('@')[0].split(/[\._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
      name: displayName || 'Valued User',
      email: email,
      tier: isPremium ? 'Premium Gold Member' : 'Standard Member'
    };
  };

  // Compute stats dynamically from live transaction state
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = profile ? parseFloat(profile.monthly_income || 0) : 0;
  const remainingBudget = totalIncome - totalExpenses;
  const budgetProgress = totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0;

  return (
    <AppContext.Provider value={{
      user: getExposedUser(),
      rawUser: user,
      session,
      loading,
      isPremium,
      categories,
      transactions,
      profile,
      createProfile,
      updateProfile,
      refreshData,
      togglePremium,
      totalExpenses,
      totalIncome,
      remainingBudget,
      budgetProgress,
      totalBudget: totalIncome
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
