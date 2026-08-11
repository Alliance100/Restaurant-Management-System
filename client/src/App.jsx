import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading } from './store/authSlice';
import api from './api/axios';

import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import MenuItemDetails from './pages/MenuItemDetails';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';



const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  // Session persistence — try to restore user from existing HTTP-only cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/auth/me');
        dispatch(setCredentials({ user: res.data.data }));
      } catch (_) {
        // Not logged in — that's fine
        dispatch(setLoading(false));
      }
    };
    restoreSession();
  }, [dispatch]);

  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ── Public Routes (with Navbar + Footer) ──────────────────────── */}
          <Route element={<PublicLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/menu"        element={<Menu />} />
        <Route path="/menu/:slug"  element={<MenuItemDetails />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/contact"     element={<Contact />} />

        {/* Protected customer routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          <Route path="/checkout"  element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>
      </Route>



      {/* ── 404 fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center">
            <h1 className="text-6xl font-black text-stone-200 dark:text-stone-800 mb-4">404</h1>
            <p className="text-stone-500 dark:text-stone-400 mb-6">Page not found</p>
            <a href="/" className="bg-orange-600 text-white px-6 py-3 rounded-sm font-bold hover:bg-orange-500 transition-all">
              Go Home
            </a>
          </div>
          </div>
        } />
      </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
