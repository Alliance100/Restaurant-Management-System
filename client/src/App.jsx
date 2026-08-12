import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading } from './store/authSlice';
import api from './api/axios';

import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

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

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/auth/me');
        dispatch(setCredentials({ user: res.data.data }));
      } catch (_) {

        dispatch(setLoading(false));
      }
    };
    restoreSession();

    // Check cart expiration every minute
    const cartCheckInterval = setInterval(() => {
      try {
        const saved = localStorage.getItem('tablecraft_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.updatedAt && Date.now() - parsed.updatedAt > 15 * 60 * 1000) {
            import('./store/cartSlice').then(({ clearCart }) => {
              dispatch(clearCart());
            });
          }
        }
      } catch (_) {}
    }, 60 * 1000);

    return () => clearInterval(cartCheckInterval);
  }, [dispatch]);

  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route element={<PublicLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/menu"        element={<Menu />} />
        <Route path="/menu/:slug"  element={<MenuItemDetails />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/contact"     element={<Contact />} />

        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          <Route path="/checkout"  element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>
      </Route>

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
