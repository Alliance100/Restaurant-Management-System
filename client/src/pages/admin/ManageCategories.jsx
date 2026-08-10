import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Tag } from 'lucide-react';
import api from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';

const defaultForm = { name: '', slug: '', imageUrl: '', sortOrder: 0, isActive: true };

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/admin');
      setCategories(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData((f) => ({ ...f, name, slug }));
  };

  const openAdd = () => {
    setFormData(defaultForm);
    setEditId(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setFormData({ name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl || '', sortOrder: cat.sortOrder, isActive: cat.isActive });
    setEditId(cat._id);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/categories/admin/${editId}`, formData);
      } else {
        await api.post('/categories/admin', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, value) => setFormData((f) => ({ ...f, [key]: value }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">Categories</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{categories.length} categories total</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Slug</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <code className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">{cat.slug}</code>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    cat.isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {cat.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => openEdit(cat)}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="4" className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No categories yet. Add one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{editId ? 'Edit' : 'Add'} Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required
                  placeholder="e.g. Burgers"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => set('slug', e.target.value)} required
                  placeholder="auto-generated"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Image</label>
                <ImageUpload value={formData.imageUrl} onChange={(url) => set('imageUrl', url)} />
              </div>

              {/* Sort + Active row */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="flex items-center gap-2 pb-2.5">
                  <input type="checkbox" id="cat-active" checked={formData.isActive} onChange={(e) => set('isActive', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer" />
                  <label htmlFor="cat-active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">Active</label>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : `${editId ? 'Update' : 'Create'} Category`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
