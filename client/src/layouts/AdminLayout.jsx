import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Tags, LogOut, Menu, X, ChefHat, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api/axios';

const navItems = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/categories', icon: Tags,             label: 'Categories' },
  { to: '/admin/menu-items', icon: UtensilsCrossed,  label: 'Menu Items' },
];

const pageTitles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/categories': 'Manage Categories',
  '/admin/menu-items': 'Manage Menu Items',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logout());
    navigate('/');
  };

  const pageTitle = pageTitles[location.pathname] || 'Admin Panel';

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ChefHat className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-none">TableCraft</h1>
            <p className="text-xs text-slate-500 mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800 space-y-1.5">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60">
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{user.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex transition-colors duration-200">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-slate-900 dark:bg-slate-900 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 flex flex-col md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-3 w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">

        {/* Header */}
        <header className="sticky top-0 z-20 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3 shadow-sm transition-colors duration-200">
          <button id="admin-menu-toggle" onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{pageTitle}</h2>
          </div>

          <Link to="/" className="hidden sm:block text-xs font-semibold text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mr-1">
            View Site ↗
          </Link>

          {/* Theme toggle */}
          <button onClick={toggleTheme} title="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
