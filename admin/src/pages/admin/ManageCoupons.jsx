import React, { useState, useEffect } from 'react';
import { Tag, Plus, ToggleLeft, ToggleRight, X, Loader2, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'percentage',
    discountValue: '', minOrderAmount: '', maxDiscountAmount: '',
    usageLimit: '', expiresAt: '',
  });
  const [error, setError] = useState('');

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const resetForm = () => {
    setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscountAmount: '', usageLimit: '', expiresAt: '' });
    setError('');
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountType === 'percentage' ? form.discountValue : form.discountValue) * (form.discountType === 'fixed' ? 100 : 1),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) * 100 : 0,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) * 100 : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      };
      
      if (editId) {
        await api.put(`/coupons/${editId}`, payload);
      } else {
        await api.post('/coupons', payload);
      }
      
      fetchCoupons();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editId ? 'update' : 'create'} coupon`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      await api.patch(`/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) { console.error(err); }
    finally { setTogglingId(null); }
  };

  const handleEditClick = (c) => {
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountType === 'percentage' ? c.discountValue : c.discountValue / 100,
      minOrderAmount: c.minOrderAmount ? c.minOrderAmount / 100 : '',
      maxDiscountAmount: c.maxDiscountAmount ? c.maxDiscountAmount / 100 : '',
      usageLimit: c.usageLimit || '',
      expiresAt: c.expiresAt ? c.expiresAt.substring(0, 10) : '',
    });
    setEditId(c._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/coupons/${deleteId}`);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-800 dark:text-stone-100">Manage Coupons</h1>
          <p className="text-sm text-stone-400 mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-sm text-sm font-bold transition-all "
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border border-stone-100 dark:border-stone-800  p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" /> {editId ? 'Edit Coupon' : 'New Coupon'}
            </h2>
            <button onClick={() => { setShowForm(false); resetForm(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Code *</label>
              <input required type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Discount Type *</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                {form.discountType === 'percentage' ? 'Discount %' : 'Discount $'} *
              </label>
              <input required type="number" min="1" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === 'percentage' ? '20' : '100'} className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Min Order ($)</label>
              <input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                placeholder="500" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            {form.discountType === 'percentage' && (
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Max Discount Cap ($)</label>
                <input type="number" min="0" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                  placeholder="200" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Usage Limit</label>
              <input type="number" min="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Unlimited" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. 20% off your first order" className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            {error && (
              <div className="sm:col-span-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-sm text-sm transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />)} 
                {editId ? 'Save Changes' : 'Create Coupon'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                className="px-5 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold rounded-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border border-stone-100 dark:border-stone-800  p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-sm opacity-40" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border border-stone-100 dark:border-stone-800  p-12 text-center">
          <Tag className="w-12 h-12 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">No coupons yet</p>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">Create your first discount code above.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border border-stone-100 dark:border-stone-800  overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700">
                <tr>
                  {['Code', 'Discount', 'Min Order', 'Used / Limit', 'Expires', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-black text-orange-600 dark:text-orange-400 text-sm">{c.code}</div>
                      {c.description && <div className="text-xs text-stone-400 mt-0.5 truncate max-w-[140px]">{c.description}</div>}
                    </td>
                    <td className="px-4 py-3 font-bold text-stone-800 dark:text-stone-100 whitespace-nowrap">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}%`
                        : `$${(c.discountValue / 100).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {c.minOrderAmount > 0 ? `$${(c.minOrderAmount / 100).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {c.usedCount} / {c.usageLimit ?? '∞'}
                    </td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400 whitespace-nowrap text-xs">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-PK') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-bold ${
                        c.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                      }`}>
                        {c.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggle(c._id)}
                          disabled={togglingId === c._id}
                          className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
                          title="Toggle Active Status"
                        >
                          {togglingId === c._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : c.isActive ? (
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditClick(c)}
                          className="text-stone-400 hover:text-orange-500 transition-colors"
                          title="Edit Coupon"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c._id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full border border-stone-100 dark:border-stone-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-black text-stone-800 dark:text-stone-100">Delete Coupon</h3>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Are you sure you want to permanently delete this coupon? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                className="flex-1 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold py-2.5 rounded-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-sm transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
