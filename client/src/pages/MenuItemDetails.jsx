import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Leaf } from 'lucide-react';
import api from '../api/axios';

const dietaryBadge = {
  vegetarian:     { label: 'Vegetarian',     cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  vegan:          { label: 'Vegan',           cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'         },
  'non-vegetarian': { label: 'Non-Veg',       cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'                 },
  'gluten-free':  { label: 'Gluten-Free',     cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'         },
};

const MenuItemDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/menu-items/${slug}`);
        setItem(res.data.data);
      } catch { navigate('/menu'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug, navigate]);

  const toggleAddOn = (id) =>
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const total = item
    ? (item.price + item.addOns.reduce((s, a) => selectedAddOns.includes(a._id) ? s + a.price : s, 0)) * quantity
    : 0;

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
  if (!item) return null;

  const badge = dietaryBadge[item.dietaryTag];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Back */}
        <button onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* ── IMAGE ─────────────────────────────────────────────────── */}
            <div className="md:w-[42%] flex-shrink-0 relative bg-slate-100 dark:bg-slate-800">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name}
                  className="w-full h-64 md:h-full object-cover" />
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">No Image</div>
              )}
              {badge && (
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
              {item.isFeatured && (
                <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
            </div>

            {/* ── DETAILS ───────────────────────────────────────────────── */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
                {item.categoryId?.name}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 mb-3 leading-tight">
                {item.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {item.preparationMinutes} min prep
                </span>
                {item.addOns?.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" /> {item.addOns.length} customizations
                  </span>
                )}
              </div>

              {/* Add-ons */}
              {item.addOns?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Customize</h3>
                  <div className="space-y-2">
                    {item.addOns.map((addon) => (
                      <label key={addon._id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedAddOns.includes(addon._id)
                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-600'
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={selectedAddOns.includes(addon._id)}
                            onChange={() => toggleAddOn(addon._id)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{addon.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          +${(addon.price / 100).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + Quantity + CTA */}
              <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Total</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
                    ${(total / 100).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Qty */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors">−</button>
                    <span className="w-8 text-center font-bold text-sm text-slate-800 dark:text-slate-100">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors">+</button>
                  </div>
                  {/* Add to cart */}
                  <button onClick={() => alert('Cart coming in Week 3!')}
                    className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;
