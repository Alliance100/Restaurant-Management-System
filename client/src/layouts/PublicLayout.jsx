import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, Menu, X, User, LogOut, ChefHat, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api/axios';

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logout());
    navigate('/');
  };

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">TableCraft</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: theme toggle + auth */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} title="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
                    <ChefHat className="w-4 h-4" /> Admin
                  </Link>
                )}
                <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <User className="w-4 h-4" /> {user.name?.split(' ')[0]}
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-800 transition-all">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Log In
                </Link>
                <Link to="/register"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-sm transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button id="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU BACKDROP ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── MOBILE MENU PANEL ────────────────────────────────────────── */}
      <div className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 px-3 ${mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 dark:border-slate-800 mx-3" />
          <div className="p-3 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">{user.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                    <ChefHat className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Log In
                </Link>
                <Link to="/register" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <main className="flex-1"><Outlet /></main>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Utensils className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white font-black text-lg">TableCraft</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                A premier dining experience crafted with passion.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[['Home', '/'], ['Menu', '/menu'], ['Log In', '/login'], ['Create Account', '/register']].map(([label, href]) => (
                  <li key={href}><Link to={href} className="text-slate-500 hover:text-white text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Opening Hours</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between text-slate-400"><span>Mon – Fri</span><span className="text-white font-medium">11am – 10pm</span></li>
                <li className="flex justify-between text-slate-400"><span>Saturday</span><span className="text-white font-medium">10am – 11pm</span></li>
                <li className="flex justify-between text-slate-400"><span>Sunday</span><span className="text-white font-medium">12pm – 9pm</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-sm">© 2026 TableCraft Restaurant. All rights reserved.</p>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Admin Portal →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
