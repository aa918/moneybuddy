<div align="center">

# 💰 MoneyBuddy

### A personal finance buddy focused on the **"why"**, not just the **"how much"**

Manage your money in seconds — with human, actionable insights, in a clean modern dark UI.

🔗 **[Live Demo »](https://moneybuddy-eta.vercel.app)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [Target Audience](#-target-audience)
- [Competitors & Differentiation](#-competitors--differentiation)
- [Key Features](#-key-features)
- [Data Model (ERD)](#️-data-model-erd)
- [Tech Stack](#️-tech-stack)
- [External Services & Integrations](#-external-services--integrations)
- [Running Locally](#-running-locally)
- [Demo User](#-demo-user)

---

## 📖 Overview

MoneyBuddy is a smart, visual personal-budgeting app. Users log expenses in two taps, get a clear monthly summary with charts, receive human-language insights, and get proactive alerts before they overspend — all in a clean, modern dark interface.

The app is fully responsive: it works as a mobile app on phones, and as a full web app with a sidebar on desktop.

## 🎯 The Problem

Most people abandon finance apps within a week. The reason: they're complicated, tedious, and make the user feel like an accountant. People know *how much* they spend, but not *why* — or *what to do about it*. MoneyBuddy turns money management from an exhausting spreadsheet into a few-seconds-a-day action, with insights that actually help you make decisions.

## 👥 Target Audience

- **Core audience:** Students and young adults (ages 20–30) living on a limited budget who want control without effort.
- **Secondary audience:** Tech-savvy users looking for a fast, efficient tool to track daily expenses on the go.

The typical user opens the app several times a day — after a purchase, on the way home, or at the end of the day — to log an expense and check where they stand against their budget.

## 🆚 Competitors & Differentiation

| Competitor | Their Weakness | MoneyBuddy's Edge |
|------------|----------------|-------------------|
| **YNAB / PocketGuard** | Complex, steep learning curve | Simple, clean, fewer screens & buttons |
| **Excel / Google Sheets** | Manual, tedious, requires discipline | Automatic entry in two taps |
| **Tracking in your head / not at all** | No control, surprise overspending | Proactive alerts *before* you overspend |

**Core differentiation:** While competitors tell you *how much you spent*, MoneyBuddy tells you *what to do tomorrow to save*. We're not "another finance tool" — we're "a friend who gets money."

---

## ⚡ Key Features

| Feature | Description |
|---------|-------------|
| 🏠 **Landing Page** | A marketing page that explains the value to visitors before login |
| 🔐 **Secure Authentication** | Full account system (Email/Password) with per-user data protection |
| ✌️ **2-Tap Expense Entry** | Amount + category, in seconds |
| 📊 **Smart Dashboard** | Monthly summary, category donut chart, and a 7-day spending chart |
| 💬 **Insight Feed** | Human-language insights instead of dry charts |
| 🗂️ **Full History** | A list of all expenses with filtering, editing, and deletion (full CRUD) |
| 🎯 **Per-Category Budgets** | A color-coded progress bar (green/amber/red) for each category |
| 💰 **Savings Goals** | Set a goal and track your progress toward it |
| 🔔 **Proactive Alerts** | A warning before exceeding a budget |
| 🖥️ **Fully Responsive** | Works on phone and desktop with an adapted layout |

---

## 🗄️ Data Model (ERD)

The database is built on **Supabase (PostgreSQL)** and includes the following tables:

- **users** (managed by Supabase Auth) — registered users
- **profiles** — extended profile (monthly income, financial goal, status)
- **expenses** — expenses (id, user_id, category_id, amount, description, created_at)
- **categories** — categories (id, name, icon, color, is_default, user_id)
- **budgets** — budgets (id, user_id, category_id, amount, month)
- **savings_goals** — savings goals (id, user_id, title, target_amount, current_amount, deadline)

**Relationships:** one user → many expenses / budgets / goals (one-to-many) · one category → many expenses (one-to-many).

<br>

<!-- ============================================= -->
<!--                                               -->
<!--          👇 PASTE THE ERD IMAGE HERE 👇       -->
<!--                                               -->
<!--   Drag the image here when editing on GitHub  -->
<!--   or use:  ![ERD](./erd.png)                  -->
<!--                                               -->
<!-- ============================================= -->

<div align="center">

### 📊 ERD Diagram

<!-- ⬇️ The image goes here ⬇️ -->

*(Paste your ERD screenshot here — from Supabase Schema Visualizer or the tool we built)*

</div>

<br>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Routing** | React Router |
| **Backend & DB** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email / Password) |
| **Deployment** | Vercel |

---

## 🔌 External Services & Integrations

| Service | Type | Purpose |
|---------|------|---------|
| **Supabase Auth** | Authentication | User registration & login (Email/Password), session management |
| **Supabase Database** | Database (PostgreSQL) | Stores expenses, categories, budgets & goals, with per-user RLS policies |
| **Vercel** | Hosting & Deployment | Hosts the live site, automatic CI/CD from GitHub |

> **🔒 Security:** All sensitive keys are managed via environment variables (`.env`) and are never exposed in the code. Data access is protected with **Row Level Security (RLS)** — each user can only see their own data.

---

## 🚀 Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/aa918/moneybuddy.git
cd moneybuddy

# 2. Install dependencies
npm install

# 3. Set up environment variables — create a .env file in the project root:
#    VITE_SUPABASE_URL=your_supabase_url
#    VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

# 4. Run
npm run dev
```

The app will run at `http://localhost:5173`

---

## 👤 Demo User

You can register instantly with any email and password via the Register screen (no email verification required).

Alternatively, use the following credentials if available:
- **Email:** `demo@moneybuddy.app`
- **Password:** `demo1234`

---

<div align="center">

Built as a final project for the **AI-Based Product Development** course 🎓

⭐ *MoneyBuddy — manage your money in seconds, not hours*

</div>
