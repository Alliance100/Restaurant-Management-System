import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Utensils, Tags, Star, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          label: 'Menu Items',
          value: stats.totalMenuItems,
          sub: 'Available items',
          icon: Utensils,
          color: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-900/30',
          border: 'border-indigo-100 dark:border-indigo-900/50',
          link: '/admin/menu-items',
        },
        {
          label: 'Categories',
          value: stats.totalCategories,
          sub: 'Active categories',
          icon: Tags,
          color: 'text-violet-600 dark:text-violet-400',
          bg: 'bg-violet-50 dark:bg-violet-900/30',
          border: 'border-violet-100 dark:border-violet-900/50',
          link: '/admin/categories',
        },
        {
          label: 'Customers',
          value: stats.totalUsers,
          sub: 'Registered users',
          icon: Users,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          border: 'border-emerald-100 dark:border-emerald-900/50',
          link: null,
        },
        {
          label: 'Featured Items',
          value: stats.featuredItems,
          sub: "Chef's picks",
          icon: Star,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          border: 'border-amber-100 dark:border-amber-900/50',
          link: '/admin/menu-items?featured=true',
        },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Welcome back 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin/menu-items"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-indigo-200 dark:shadow-none btn-glow"
        >
          Add Menu Item <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="skeleton w-12 h-12 rounded-xl mb-4 opacity-50" />
              <div className="skeleton h-8 w-16 rounded mb-2 opacity-50" />
              <div className="skeleton h-3 w-28 rounded opacity-50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            const content = (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border ${card.border} shadow-sm card-lift group cursor-pointer`}
              >
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {card.value}
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{card.label}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{card.sub}</div>
              </div>
            );
            return card.link ? (
              <Link to={card.link} key={idx} className="block">{content}</Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Add a new menu item',   desc: 'Create dishes for your customers',     href: '/admin/menu-items', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' },
              { label: 'Manage categories',      desc: 'Organise your menu sections',          href: '/admin/categories', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40'  },
              { label: 'View public menu',       desc: 'See your menu as a customer',          href: '/menu',             color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
            ].map((a) => (
              <Link
                key={a.href}
                to={a.href}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${a.color}`}
              >
                <div>
                  <div className="text-sm font-bold">{a.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{a.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-black mb-2">Orders Coming in Week 3</h3>
            <p className="text-indigo-200 text-sm leading-relaxed mb-4">
              The ordering system, cart functionality, Stripe payments, and real-time order tracking will be added in the next module.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Revenue Overview</h3>
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-3 py-1 rounded-full">Coming Week 3</span>
        </div>
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
          {/* Decorative bar chart placeholder */}
          <div className="flex items-end gap-3 h-32">
            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
              <div
                key={i}
                className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Charts and revenue data will appear once orders start coming in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
