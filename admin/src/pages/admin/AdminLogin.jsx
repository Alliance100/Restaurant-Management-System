import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { ChefHat, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.data.role !== 'admin') {
          setError('Access denied. This portal is for administrators only.');
          setIsLoading(false);
          return;
        }
        dispatch(setCredentials({ user: res.data.data }));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <a
          href="http://localhost:5173"
          className="flex items-center gap-2 text-stone-500 hover:text-white text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to site
        </a>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center">
            <ChefHat className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold text-sm">TableCraft</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600/20 border border-orange-600/30 rounded-none border border-stone-200 dark:border-stone-800 mb-5">
              <ShieldCheck className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Admin Portal</h1>
            <p className="text-stone-400 text-sm">
              Restricted access — authorized personnel only
            </p>
          </div>

          {/* Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-none border border-stone-200 dark:border-stone-800 p-8 shadow-2xl">

            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-sm text-sm">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-stone-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tablecraft.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 rounded-sm text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-stone-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 rounded-sm text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-sm transition-all shadow-lg shadow-orange-900/40 mt-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign in to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-stone-800 text-center">
              <p className="text-stone-600 text-xs">
                Not an admin?{' '}
                <a href="http://localhost:5173/login" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
                  Customer login →
                </a>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <p className="text-center text-stone-600 text-xs mt-6">
            🔒 All access attempts are logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
