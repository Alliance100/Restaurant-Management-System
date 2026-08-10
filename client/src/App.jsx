import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from './store/authSlice';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import MenuItemDetails from './pages/MenuItemDetails';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageMenu from './pages/admin/ManageMenu';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set loading false after mount (no session persistence yet — Week 3)
    const t = setTimeout(() => dispatch(setLoading(false)), 400);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <Routes>
      {/* ── Public Routes (with Navbar + Footer) ──────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/"        element={<Home />} />
        <Route path="/menu"    element={<Menu />} />
        <Route path="/menu/:slug" element={<MenuItemDetails />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── Admin Login — Standalone (no PublicLayout) ─────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin Routes (Protected — admin role only) ─────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard"  element={<Dashboard />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/menu-items" element={<ManageMenu />} />
        </Route>
      </Route>

      {/* ── 404 fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
            <p className="text-slate-500 mb-6">Page not found</p>
            <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
              Go Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default App;
