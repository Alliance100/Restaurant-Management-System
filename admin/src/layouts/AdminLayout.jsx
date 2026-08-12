import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Tags, LogOut, Menu, X, ChefHat, Sun, Moon, ShoppingBag, Ticket, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api/axios';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/menu-items', icon: UtensilsCrossed, label: 'Menu Items' },
  { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
];

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Manage Orders',
  '/admin/categories': 'Manage Categories',
  '/admin/menu-items': 'Manage Menu Items',
  '/admin/coupons': 'Manage Coupons',
  '/admin/messages': 'Inbox',
  '/admin/profile': 'Profile Settings',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { isDark, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/messages/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    const pageTitle = pageTitles[location.pathname] || 'Admin Panel';
    document.title = `TableCraft Admin | ${pageTitle}`;
    return () => {
      document.title = 'TableCraft';
    };
  }, [location.pathname]);

  const confirmLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) { }
    dispatch(logout());
    navigate('/');
  };

  const pageTitle = pageTitles[location.pathname] || 'Admin Panel';

  const SidebarContent = () => (
    <>
      
      <div className="px-5 py-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <ChefHat className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-none">TableCraft</h1>
            <p className="text-xs text-stone-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold transition-all ${active
                  ? 'bg-orange-600 text-white '
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {to === '/admin/messages' && unreadCount > 0 && (
                <span className="ml-auto bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-800 space-y-1.5">
        {user && (
          <Link to="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-sm bg-stone-800/60 hover:bg-stone-800 transition-all group">
            <div className="w-7 h-7 bg-orange-600 rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{user.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors">{user.name}</div>
              <div className="text-xs text-stone-500 capitalize">{user.role}</div>
            </div>
          </Link>
        )}
        <button onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-stone-400 hover:text-red-400 hover:bg-red-900/20 rounded-sm text-sm font-semibold transition-all">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex transition-colors duration-200">

      <aside className="hidden md:flex w-60 bg-stone-900 dark:bg-stone-900 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-stone-900 flex flex-col md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-3 w-7 h-7 bg-stone-800 hover:bg-stone-700 rounded-lg flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-stone-400" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen md:ml-60">

        <header className="sticky top-0 z-20 h-14 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center px-4 gap-3  transition-colors duration-200">
          <button id="admin-menu-toggle" onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-bold text-stone-800 dark:text-stone-100">{pageTitle}</h2>
          </div>

          <a href="http://localhost:5173" className="hidden sm:block text-xs font-semibold text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mr-1">
            View Site ↗
          </a>

          <button onClick={toggleTheme} title="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-all">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-7 h-7 bg-orange-600 rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'A'}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full border border-stone-100 dark:border-stone-800 shadow-2xl">
            <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 mb-2">Sign Out</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Are you sure you want to sign out of the Admin Panel?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold py-2.5 rounded-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-sm transition-all text-sm "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
