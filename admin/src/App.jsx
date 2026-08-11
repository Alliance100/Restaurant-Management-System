import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading } from './store/authSlice';
import api from './api/axios';

import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageCategories from './pages/admin/ManageCategories';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCoupons from './pages/admin/ManageCoupons';
import ManageMessages from './pages/admin/ManageMessages';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

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
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-sm" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<AdminLogin />} />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu-items" element={<ManageMenu />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="coupons" element={<ManageCoupons />} />
            <Route path="messages" element={<ManageMessages />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default App;
