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
  const [isFetching, setIsFetching] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

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
          categoryId: exp.category_id,
          rawDescription: exp.description,
          type: 'expense',
          date: exp.created_at
        }));
        setTransactions(mappedExpenses);
      }

      // 4. Fetch per-category monthly budgets
      const { data: budgetData, error: budgetErr } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (budgetErr) {
        console.error('Error fetching budgets from database:', budgetErr);
      } else {
        setBudgets(budgetData || []);
      }

      // 5. Fetch savings goals
      const { data: goalsData, error: goalsErr } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (goalsErr) {
        console.error('Error fetching savings goals from database:', goalsErr);
      } else {
        setSavingsGoals(goalsData || []);
      }
    } catch (err) {
      console.error('Unexpected error in database fetch sequence:', err);
    }
  };

  // Helper function to allow manual triggers of state refreshes
  const refreshData = async () => {
    if (user) {
      setIsFetching(true);
      await fetchUserData(user.id);
      setIsFetching(false);
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

  // Update existing expense in Supabase
  const updateExpense = async (expenseId, updates) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: parseFloat(updates.amount),
          category_id: updates.category_id,
          description: updates.description,
          created_at: updates.created_at
        })
        .eq('id', expenseId)
        .select();

      if (error) {
        console.error('Error updating expense in database:', error);
        return { success: false, error };
      }

      await refreshData();
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating expense:', err);
      return { success: false, error: err };
    }
  };

  // Delete existing expense from Supabase
  const deleteExpense = async (expenseId) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) {
        console.error('Error deleting expense from database:', error);
        return { success: false, error };
      }

      await refreshData();
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting expense:', err);
      return { success: false, error: err };
    }
  };

  // Upsert a monthly budget limit for a specific category
  const setBudget = async (categoryId, monthlyLimit) => {
    if (!user) return { success: false, error: 'No authenticated user session.' };
    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user.id,
          category_id: categoryId,
          monthly_limit: parseFloat(monthlyLimit),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,category_id' })
        .select()
        .single();

      if (error) {
        console.error('Error upserting budget in database:', error);
        return { success: false, error };
      }

      setBudgets(prev => {
        const idx = prev.findIndex(b => b.category_id === categoryId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error upserting budget:', err);
      return { success: false, error: err };
    }
  };

  // Create a new savings goal
  const createSavingsGoal = async ({ title, target_amount, deadline }) => {
    if (!user) return { success: false, error: 'No authenticated user session.' };
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: user.id,
          title: title.trim(),
          target_amount: parseFloat(target_amount),
          current_amount: 0,
          deadline: deadline || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating savings goal in database:', error);
        return { success: false, error };
      }

      setSavingsGoals(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error creating savings goal:', err);
      return { success: false, error: err };
    }
  };

  // Update an existing savings goal
  const updateSavingsGoal = async (goalId, updates) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('Error updating savings goal in database:', error);
        return { success: false, error };
      }

      setSavingsGoals(prev => prev.map(g => g.id === goalId ? data : g));
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error updating savings goal:', err);
      return { success: false, error: err };
    }
  };

  // Delete a savings goal
  const deleteSavingsGoal = async (goalId) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Error deleting savings goal from database:', error);
        return { success: false, error };
      }

      setSavingsGoals(prev => prev.filter(g => g.id !== goalId));
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting savings goal:', err);
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
        setBudgets([]);
        setSavingsGoals([]);
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
      isFetching,
      isPremium,
      categories,
      transactions,
      profile,
      budgets,
      savingsGoals,
      createProfile,
      updateProfile,
      updateExpense,
      deleteExpense,
      setBudget,
      createSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
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
