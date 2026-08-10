import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, X, Utensils } from 'lucide-react';
import api from '../../api/axios';
import ImageUpload from '../../components/ImageUpload';

const initialForm = {
  categoryId: '', name: '', slug: '', description: '',
  price: 0, imageUrl: '', dietaryTag: 'none',
  isAvailable: true, isFeatured: false, preparationMinutes: 15,
};

const dietaryOptions = [
  { value: 'none',           label: 'None'           },
  { value: 'vegetarian',     label: 'Vegetarian'     },
  { value: 'vegan',          label: 'Vegan'          },
  { value: 'gluten-free',    label: 'Gluten-Free'    },
  { value: 'non-vegetarian', label: 'Non-Vegetarian' },
];

const ManageMenu = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [itemsRes, catRes] = await Promise.all([api.get('/menu-items/admin?limit=100'), api.get('/categories/admin')]);
      
      let fetchedItems = itemsRes.data.data;
      if (searchParams.get('featured') === 'true') {
        fetchedItems = fetchedItems.filter(item => item.isFeatured);
      }
      
      setItems(fetchedItems);
      setCategories(catRes.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [searchParams]);

  const set = (key, value) => setFormData((f) => ({ ...f, [key]: value }));

  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData((f) => ({ ...f, name, slug }));
  };

  const openAdd = () => {
    setFormData({ ...initialForm, categoryId: categories[0]?._id || '' });
    setEditId(null); setError(null); setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ ...item, categoryId: item.categoryId._id });
    setEditId(item._id); setError(null); setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setSaving(true);
    try {
      if (editId) { await api.patch(`/menu-items/admin/${editId}`, formData); }
      else         { await api.post('/menu-items/admin', formData); }
      setIsModalOpen(false); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">Menu Items</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{items.length} items total</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{item.name}</div>
                        {item.isFeatured && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⭐ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{item.categoryId?.name}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">${(item.price / 100).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.isAvailable
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.isAvailable ? '● Available' : '○ Unavailable'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => openEdit(item)}
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-400 text-sm">No menu items yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{editId ? 'Edit' : 'Add'} Menu Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1">
              <form id="menu-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="e.g. Margherita Pizza"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => set('slug', e.target.value)} required
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-mono" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={formData.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="What makes this dish special?"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                </div>

                {/* Category + Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Category *</label>
                    <select value={formData.categoryId} onChange={(e) => set('categoryId', e.target.value)} required
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all">
                      <option value="">Select…</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Price (cents) *</label>
                    <input type="number" min="0" value={formData.price} onChange={(e) => set('price', Number(e.target.value))} required
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all" />
                    <p className="text-xs text-slate-400 mt-1">${(formData.price / 100).toFixed(2)} USD</p>
                  </div>
                </div>

                {/* Dietary + Prep */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Dietary Tag</label>
                    <select value={formData.dietaryTag} onChange={(e) => set('dietaryTag', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all">
                      {dietaryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Prep Time (min)</label>
                    <input type="number" min="1" value={formData.preparationMinutes} onChange={(e) => set('preparationMinutes', Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Image</label>
                  <ImageUpload value={formData.imageUrl} onChange={(url) => set('imageUrl', url)} />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isAvailable} onChange={(e) => set('isAvailable', e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 rounded text-amber-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Featured ⭐</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <button type="submit" form="menu-form" disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : `${editId ? 'Update' : 'Create'} Menu Item`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
