import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.data }));
        navigate(res.data.data.role === 'admin' ? '/admin/dashboard' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-12 bg-stone-50 dark:bg-stone-950 transition-colors duration-200">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-1">Welcome back</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">Sign in to your TableCraft account</p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800  border border-stone-200 dark:border-stone-800 p-6">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3 rounded-sm transition-all mt-2">
              {isLoading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-5">
          New here?{' '}
          <Link to="/register" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-stone-400 dark:text-stone-600 mt-3">
          Are you an admin?{' '}
          <Link to="/admin/login" className="text-stone-500 dark:text-stone-500 hover:text-orange-500 transition-colors">
            Admin portal →
          </Link>
        </p>
      </div>
    </div>
      </PageTransition>

    );
};

export default Login;
