import React from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Leaf, ShoppingBag, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import api from '../api/axios';

const dietaryBadge = {
  vegetarian: { label: 'Vegetarian', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  vegan: { label: 'Vegan', cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  'non-vegetarian': { label: 'Non-Veg', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  'gluten-free': { label: 'Gluten-Free', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
};

const MenuItemDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [added, setAdded] = useState(false);

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

  const toggleAddOn = (addon) =>
    setSelectedAddOns((prev) =>
      prev.some((a) => a._id === addon._id)
        ? prev.filter((a) => a._id !== addon._id)
        : [...prev, addon]
    );

  const total = item
    ? (item.price + selectedAddOns.reduce((s, a) => s + a.price, 0)) * quantity
    : 0;

  const handleAddToCart = () => {
    if (!item) return;
    dispatch(addToCart({
      menuItemId: item._id,
      name: item.name,
      slug: item.slug,
      imageUrl: item.imageUrl,
      categoryName: item.categoryId?.name,
      basePrice: item.price,
      quantity,
      selectedAddOns,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <PageTransition>
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-sm animate-spin" />
    </div>
    </PageTransition>
  );
  if (!item) return null;

  const badge = dietaryBadge[item.dietaryTag];

  return (
    <PageTransition>
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Back */}
        <button onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </button>

        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800  border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* ── IMAGE ─────────────────────────────────────────────────── */}
            <div className="md:w-[42%] flex-shrink-0 relative bg-stone-100 dark:bg-stone-800">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name}
                  className="w-full h-64 md:h-full object-cover" />
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center text-stone-400 dark:text-stone-600 text-sm">No Image</div>
              )}
              {badge && (
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-sm  ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
              {item.isFeatured && (
                <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
            </div>

            {/* ── DETAILS ───────────────────────────────────────────────── */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              <div className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">
                {item.categoryId?.name}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-50 mb-3 leading-tight">
                {item.name}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-stone-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" /> {item.preparationMinutes} min prep
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
                  <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">Customize</h3>
                  <div className="space-y-2">
                    {item.addOns.map((addon) => (
                      <label key={addon._id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-sm border cursor-pointer transition-all ${selectedAddOns.some((a) => a._id === addon._id)
                            ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-600'
                            : 'border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-700'
                          }`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox"
                            checked={selectedAddOns.some((a) => a._id === addon._id)}
                            onChange={() => toggleAddOn(addon)}
                            className="w-4 h-4 text-orange-600 rounded border-stone-300 dark:border-stone-600" />
                          <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{addon.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          +${(addon.price / 100).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + Quantity + CTA */}
              <div className="mt-auto pt-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">Total</div>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
                    ${(total / 100).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Qty */}
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-sm p-1 gap-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-stone-700  flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 hover:text-orange-600 transition-colors">−</button>
                    <span className="w-8 text-center font-bold text-sm text-stone-800 dark:text-stone-100">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-stone-700  flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 hover:text-orange-600 transition-colors">+</button>
                  </div>
                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-sm font-bold text-sm transition-all  active:scale-95 ${added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                      }`}
                  >
                    {added ? (
                      <><CheckCircle className="w-4 h-4" /> Added!</>
                    ) : (
                      <><ShoppingBag className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick view cart hint */}
              {added && (
                <div className="mt-3 text-center">
                  <Link to="/checkout" className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline">
                    Go to Checkout →
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
      </PageTransition>

    );
};

export default MenuItemDetails;
