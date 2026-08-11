import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.data }));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="flex min-h-[calc(100vh-130px)] w-full items-center justify-center p-6 bg-stone-50 dark:bg-stone-950 transition-colors duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-10  border border-stone-200 dark:border-stone-800">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mb-2">Create Account</h2>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Join TableCraft to order delicious food</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-sm bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">Full Name</label>
            <input type="text" name="name" onChange={handleChange} required placeholder="John Doe"
              className="w-full px-4 py-3 rounded-sm text-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">Email Address</label>
            <input type="email" name="email" onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-sm text-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">Phone Number</label>
            <input type="tel" name="phone" onChange={handleChange} required placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 rounded-sm text-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">Password</label>
            <input type="password" name="password" onChange={handleChange} required placeholder="••••••••"
              className="w-full px-4 py-3 rounded-sm text-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-6 w-full rounded-sm bg-orange-600 px-4 py-3 text-white font-bold  hover:bg-orange-500 focus:outline-none transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-sm animate-spin"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm font-medium text-stone-500 dark:text-stone-400">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 dark:text-orange-400 hover:text-orange-500 hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
      </PageTransition>

    );
};

export default Register;
