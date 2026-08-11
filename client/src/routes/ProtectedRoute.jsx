import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-sm border-4 border-orange-600/30 border-t-orange-600" />
          <p className="text-stone-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const requiresAdmin = allowedRoles.includes('admin');

  if (!isAuthenticated || !user) {

    return <Navigate to={requiresAdmin ? '/admin/login' : '/login'} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {

    return <Navigate to={requiresAdmin ? '/admin/login' : '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
