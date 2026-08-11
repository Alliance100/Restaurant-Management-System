import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { setCredentials } from '../store/authSlice';

const ProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    address: {
      line1: user?.addresses?.[0]?.line1 || '',
      city: user?.addresses?.[0]?.city || 'Lahore',
      postalCode: user?.addresses?.[0]?.postalCode || '',
      instructions: user?.addresses?.[0]?.instructions || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      const res = await api.put('/auth/profile', dataToSubmit);
      dispatch(setCredentials({ user: res.data.data }));
      setSuccess(true);
      
      setFormData(prev => ({ ...prev, password: '' }));
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 max-w-2xl w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-sm flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-black text-stone-800 dark:text-stone-100 mb-6">Update Profile</h3>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-sm border border-red-100 dark:border-red-800 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-sm border border-green-100 dark:border-green-800 text-sm font-semibold">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-4">
              <h4 className="text-sm font-black text-orange-600 dark:text-orange-400 border-b border-stone-100 dark:border-stone-800 pb-2 mb-4">Account Details</h4>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">New Password <span className="text-stone-400 font-normal normal-case">(Optional)</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-orange-600 dark:text-orange-400 border-b border-stone-100 dark:border-stone-800 pb-2 mb-4">Default Delivery Address</h4>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Street Address</label>
                <input type="text" name="address.line1" value={formData.address.line1} onChange={handleChange} placeholder="House/Flat number, Street, Area" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">City</label>
                  <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Postal Code</label>
                  <input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} placeholder="54000" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">Delivery Instructions</label>
                <input type="text" name="address.instructions" value={formData.address.instructions} onChange={handleChange} placeholder="Ring the bell, leave at gate, etc." className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white font-bold py-3 rounded-sm transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
