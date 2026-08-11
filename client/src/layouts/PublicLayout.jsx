import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, Menu, X, User, LogOut, ChefHat, Sun, Moon, ShoppingBag, ClipboardList, Phone } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';
import { selectCartCount } from '../store/cartSlice';
import CartDrawer from '../components/CartDrawer';
import ProfileModal from '../components/ProfileModal';
import api from '../api/axios';

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { isDark, toggleTheme } = useTheme();
  const cartCount = useSelector(selectCartCount);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = (mobileOpen && !cartOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, cartOpen]);

  const confirmLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    dispatch(logout());
    setMobileOpen(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">

      <header className="sticky top-0 z-50 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800  transition-colors duration-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center ">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">TableCraft</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`px-4 py-2 rounded-sm text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            
            <button onClick={toggleTheme} title="Toggle theme"
              className="w-9 h-9 rounded-sm flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-700">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              id="cart-btn"
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-sm flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-700"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-sm flex items-center justify-center ">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/my-orders"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
                    <ClipboardList className="w-4 h-4" /> My Orders
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all">
                    <ChefHat className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-sm transition-all">
                  <User className="w-4 h-4" /> {user.name?.split(' ')[0]}
                </button>
                <button onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-800 transition-all">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 rounded-sm text-sm font-semibold text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all">
                  Log In
                </Link>
                <Link to="/register"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-sm text-sm font-bold  transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-sm flex items-center justify-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-sm flex items-center justify-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-sm flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <button id="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation"
              className="w-9 h-9 flex items-center justify-center rounded-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-700">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 px-3 ${mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'}`}>
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`flex items-center px-4 py-3 rounded-sm text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-stone-100 dark:border-stone-800 mx-3" />
          <div className="p-3 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-sm">
                  <button onClick={() => { setMobileOpen(false); setShowProfileModal(true); }} className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-sm flex items-center justify-center hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                    <span className="text-orange-700 dark:text-orange-300 font-bold text-sm">{user.name?.charAt(0)}</span>
                  </button>
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-stone-500 capitalize">{user.role}</div>
                  </div>
                </div>
                {user.role === 'customer' && (
                  <Link to="/my-orders" className="flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800">
                    <ClipboardList className="w-4 h-4" /> My Orders
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30">
                    <ChefHat className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center px-4 py-3 rounded-sm text-sm font-semibold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800">
                  Log In
                </Link>
                <Link to="/register" className="block w-full text-center px-4 py-3 rounded-sm text-sm font-bold bg-orange-600 hover:bg-orange-500 text-white">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-stone-900 dark:bg-stone-950 border-t border-stone-800">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Utensils className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white font-black text-lg">TableCraft</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                A premier dining experience crafted with passion. Serving Lahore's finest cuisine.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[['Home', '/'], ['Menu', '/menu'], ['Contact', '/contact'], ['Log In', '/login'], ['Create Account', '/register']].map(([label, href]) => (
                  <li key={href}><Link to={href} className="text-stone-500 hover:text-white text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Opening Hours</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between text-stone-400"><span>Mon – Fri</span><span className="text-white font-medium">11am – 10pm</span></li>
                <li className="flex justify-between text-stone-400"><span>Saturday</span><span className="text-white font-medium">10am – 11pm</span></li>
                <li className="flex justify-between text-stone-400"><span>Sunday</span><span className="text-white font-medium">12pm – 9pm</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Contact Us</h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 mt-0.5 text-orange-400 flex-shrink-0" /><span>+92 300 1234567</span></li>
                <li className="flex items-start gap-2"><Utensils className="w-3.5 h-3.5 mt-0.5 text-orange-400 flex-shrink-0" /><span>hello@tablecraft.pk</span></li>
                <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">📍</span><span>Gulberg, Lahore, Pakistan</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex justify-center">
            <p className="text-stone-500 text-sm text-center">© 2026 TableCraft Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full border border-stone-100 dark:border-stone-800 shadow-2xl">
            <h3 className="text-lg font-black text-stone-800 dark:text-stone-100 mb-2">Sign Out</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Are you sure you want to sign out of your account?</p>
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

export default PublicLayout;
