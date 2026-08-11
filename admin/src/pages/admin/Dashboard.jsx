import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Utensils, Tags, Star, ArrowRight, TrendingUp, Clock, CheckCircle, Package } from 'lucide-react';
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
          label: 'Total Orders',
          value: stats.totalOrders,
          sub: `${stats.pendingOrders} pending approval`,
          icon: ShoppingBag,
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/30',
          border: 'border-orange-100 dark:border-orange-900/50',
          link: '/admin/orders',
          badge: stats.pendingOrders > 0 ? stats.pendingOrders : null,
        },
        {
          label: "Today's Orders",
          value: stats.todayOrders,
          sub: `$${(stats.todayRevenue / 100).toFixed(2)} revenue today`,
          icon: TrendingUp,
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          border: 'border-emerald-100 dark:border-emerald-900/50',
          link: '/admin/orders',
          badge: null,
        },
        {
          label: 'Menu Items',
          value: stats.totalMenuItems,
          sub: `${stats.featuredItems} featured`,
          icon: Utensils,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          border: 'border-amber-100 dark:border-amber-900/50',
          link: '/admin/menu-items',
          badge: null,
        },
        {
          label: 'Customers',
          value: stats.totalUsers,
          sub: 'Registered users',
          icon: Users,
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          border: 'border-amber-100 dark:border-amber-900/50',
          link: null,
          badge: null,
        },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-800 dark:text-stone-100">Welcome back!</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-sm text-sm font-bold transition-all  shadow-orange-200 dark:shadow-none btn-glow"
        >
          {stats?.pendingOrders > 0 ? (
            <>
              <span className="w-5 h-5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-sm flex items-center justify-center">
                {stats.pendingOrders}
              </span>
              Pending Orders
            </>
          ) : (
            <>Manage Orders <ArrowRight className="w-4 h-4" /></>
          )}
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
              <div className="skeleton w-12 h-12 rounded-sm mb-4 opacity-50" />
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
                className={`relative bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border ${card.border}  card-lift group cursor-pointer`}
              >
                {card.badge && (
                  <span className="absolute top-3 right-3 w-6 h-6 bg-amber-500 text-white text-[10px] font-black rounded-sm flex items-center justify-center animate-pulse">
                    {card.badge}
                  </span>
                )}
                <div className={`w-12 h-12 ${card.bg} rounded-sm flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {card.value ?? '—'}
                </div>
                <div className="text-sm font-bold text-stone-700 dark:text-stone-300">{card.label}</div>
                <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{card.sub}</div>
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

      {/* Quick Actions + Orders panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'View Orders',            desc: 'Approve or reject new orders',         href: '/admin/orders',     color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40',   badge: stats?.pendingOrders },
              { label: 'Add a new menu item',    desc: 'Create dishes for your customers',     href: '/admin/menu-items', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40' },
              { label: 'Manage categories',      desc: 'Organise your menu sections',          href: '/admin/categories', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'  },
              { label: 'Manage coupons',         desc: 'Create discount codes',                href: '/admin/coupons',    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' },
              { label: 'View public menu',       desc: 'See your menu as a customer',          href: 'http://localhost:5173/menu', isExternal: true, color: 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700' },
            ].map((a) => {
              const content = (
                <>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      {a.label}
                      {a.badge > 0 && (
                        <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-sm flex items-center justify-center animate-pulse">
                          {a.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-70 mt-0.5">{a.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </>
              );

              return a.isExternal ? (
                <a key={a.href} href={a.href} className={`flex items-center justify-between p-4 rounded-sm transition-all ${a.color}`}>
                  {content}
                </a>
              ) : (
                <Link key={a.href} to={a.href} className={`flex items-center justify-between p-4 rounded-sm transition-all ${a.color}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-5 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Order Status
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-10 rounded-sm opacity-40" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Pending Approval', value: stats?.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/admin/orders' },
                { label: "Today's Orders",   value: stats?.todayOrders,   icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', link: '/admin/orders' },
                { label: 'Total Orders',     value: stats?.totalOrders,   icon: Package, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', link: '/admin/orders' },
                { label: 'Revenue (Today)',  value: `$${((stats?.todayRevenue || 0) / 100).toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/admin/orders' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Link to={s.link} key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-sm hover:opacity-80 transition-opacity ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                    <span className={`text-sm font-semibold ${s.color} flex-1`}>{s.label}</span>
                    <span className={`text-sm font-black ${s.color}`}>{s.value ?? '—'}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue chart placeholder → now shows real info */}
      <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-8 border border-stone-100 dark:border-stone-800 ">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-100">Revenue Overview</h3>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded-sm">
            Today: ${((stats?.todayRevenue || 0) / 100).toFixed(2)}
          </span>
        </div>
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
          <div className="flex items-end gap-3 h-32">
            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
              <div
                key={i}
                className="w-8 rounded-t-lg bg-gradient-to-t from-orange-400 to-orange-200 dark:from-orange-700 dark:to-orange-900"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Detailed analytics charts coming in future updates.
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Total orders so far: <strong className="text-orange-600 dark:text-orange-400">{stats?.totalOrders ?? 0}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
