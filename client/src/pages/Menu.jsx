import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Clock, Star, Leaf, Flame, X } from 'lucide-react';
import api from '../api/axios';

const dietaryConfig = {
  vegetarian:     { label: 'Vegetarian', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  vegan:          { label: 'Vegan',       color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',   dot: 'bg-green-500'   },
  'non-vegetarian':{ label: 'Non-Veg',   color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',       dot: 'bg-red-500'     },
  'gluten-free':  { label: 'Gluten-Free', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',  dot: 'bg-amber-500'   },
};

const Menu = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    dietaryTag: '',
    sort: 'price_asc',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      ).toString();
      const [itemsRes, catRes] = await Promise.all([
        api.get(`/menu-items?${query}`),
        api.get('/categories'),
      ]);
      setItems(itemsRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const clearFilters = () => setFilters({ search: '', category: '', dietaryTag: '', sort: 'price_asc' });
  const activeFilterCount = [filters.category, filters.dietaryTag, filters.search].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-white/80 text-sm font-medium mb-4">
            <Flame className="w-3.5 h-3.5 text-amber-300" /> Fresh Today
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Our Menu</h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Discover our delicious offerings crafted with the freshest ingredients.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-10">

        {/* ── CATEGORY PILLS ───────────────────────────────────────────────── */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2.5 w-max">
            <button
              onClick={() => setFilter('category', '')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                filters.category === ''
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              🍽️ All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setFilter('category', filters.category === cat.slug ? '' : cat.slug)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                  filters.category === cat.slug
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                )}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── SEARCH + FILTERS BAR ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="menu-search"
              type="text"
              placeholder="Search for dishes..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all shadow-sm"
            />
            {filters.search && (
              <button
                onClick={() => setFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`sm:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all shadow-sm ${
              activeFilterCount > 0
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort + Dietary (desktop inline) */}
          <div className="hidden sm:flex gap-3">
            <select
              id="dietary-filter"
              value={filters.dietaryTag}
              onChange={(e) => setFilter('dietaryTag', e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
            >
              <option value="">🍴 Any Dietary</option>
              <option value="vegetarian">🥗 Vegetarian</option>
              <option value="vegan">🌱 Vegan</option>
              <option value="non-vegetarian">🍗 Non-Vegetarian</option>
              <option value="gluten-free">🌾 Gluten-Free</option>
            </select>
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
            >
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="newest">✨ Newest First</option>
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Mobile Filters Panel */}
        {filtersOpen && (
          <div className="sm:hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm animate-slide-down space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Dietary</label>
              <select
                value={filters.dietaryTag}
                onChange={(e) => setFilter('dietaryTag', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Any Dietary</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* ── RESULTS COUNT ────────────────────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} found
              {filters.category && categories.find(c => c.slug === filters.category) &&
                ` in ${categories.find(c => c.slug === filters.category).name}`}
            </p>
          </div>
        )}

        {/* ── GRID ─────────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="skeleton aspect-[4/3] opacity-50" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-1/3 rounded-full opacity-50" />
                  <div className="skeleton h-4 w-4/5 rounded opacity-50" />
                  <div className="skeleton h-3 w-full rounded opacity-50" />
                  <div className="skeleton h-3 w-2/3 rounded opacity-50" />
                  <div className="flex justify-between pt-2">
                    <div className="skeleton h-5 w-1/4 rounded opacity-50" />
                    <div className="skeleton h-8 w-1/3 rounded-xl opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No dishes found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, i) => {
              const dietary = dietaryConfig[item.dietaryTag];
              return (
                <Link
                  to={`/menu/${item.slug}`}
                  key={item._id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-indigo-900/20 border border-slate-100 dark:border-slate-800 transition-all duration-300 card-lift flex flex-col"
                  style={{ animationDelay: `${(i % 8) * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Featured badge */}
                    {item.isFeatured && (
                      <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </div>
                    )}

                    {/* Dietary badge */}
                    {dietary && (
                      <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${dietary.color}`}>
                        {dietary.label}
                      </div>
                    )}

                    {/* Prep time */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3" /> {item.preparationMinutes} min
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
                      {item.categoryId?.name}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Add-ons indicator */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-3">
                        <Leaf className="w-3 h-3" />
                        {item.addOns.length} customization{item.addOns.length > 1 ? 's' : ''} available
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800 mt-auto">
                      <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                        ${(item.price / 100).toFixed(2)}
                      </span>
                      <span className="bg-slate-900 dark:bg-slate-800 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
