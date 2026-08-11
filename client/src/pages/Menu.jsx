import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Clock, Star, Leaf, Flame, X } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
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
    <PageTransition>
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-200">

      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-purple-700 py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-sm blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white rounded-sm blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-sm text-white/80 text-sm font-medium mb-4">
            <Flame className="w-3.5 h-3.5 text-amber-300" /> Fresh Today
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Our Menu</h1>
          <p className="text-orange-200 text-lg max-w-xl mx-auto">
            Discover our delicious offerings crafted with the freshest ingredients.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-10">

        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2.5 w-max">
            <button
              onClick={() => setFilter('category', '')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-bold transition-all border ${
                filters.category === ''
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200 dark:shadow-none'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              🍽️ All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setFilter('category', filters.category === cat.slug ? '' : cat.slug)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-bold transition-all border ${
                  filters.category === cat.slug
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200 dark:shadow-none'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt="" className="w-5 h-5 rounded-sm object-cover" />
                )}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              id="menu-search"
              type="text"
              placeholder="Search for dishes..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-medium text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 transition-all "
            />
            {filters.search && (
              <button
                onClick={() => setFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-sm flex items-center justify-center transition-all"
              >
                <X className="w-3 h-3 text-stone-600 dark:text-stone-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`sm:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-bold border transition-all  ${
              activeFilterCount > 0
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="hidden sm:flex gap-3">
            <select
              id="dietary-filter"
              value={filters.dietaryTag}
              onChange={(e) => setFilter('dietaryTag', e.target.value)}
              className="px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500 transition-all  cursor-pointer"
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
              className="px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500 transition-all  cursor-pointer"
            >
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="newest">✨ Newest First</option>
            </select>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-none border border-stone-200 dark:border-stone-800 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="sm:hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-none border border-stone-200 dark:border-stone-800 p-4 mb-6  animate-slide-down space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 block">Dietary</label>
              <select
                value={filters.dietaryTag}
                onChange={(e) => setFilter('dietaryTag', e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500"
              >
                <option value="">Any Dietary</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="w-full py-2.5 rounded-sm text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} found
              {filters.category && categories.find(c => c.slug === filters.category) &&
                ` in ${categories.find(c => c.slug === filters.category).name}`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden border border-stone-100 dark:border-stone-800 ">
                <div className="skeleton aspect-[4/3] opacity-50" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-1/3 rounded-sm opacity-50" />
                  <div className="skeleton h-4 w-4/5 rounded opacity-50" />
                  <div className="skeleton h-3 w-full rounded opacity-50" />
                  <div className="skeleton h-3 w-2/3 rounded opacity-50" />
                  <div className="flex justify-between pt-2">
                    <div className="skeleton h-5 w-1/4 rounded opacity-50" />
                    <div className="skeleton h-8 w-1/3 rounded-sm opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-16 text-center border border-stone-100 dark:border-stone-800 ">
            <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-stone-400 dark:text-stone-500" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">No dishes found</h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-none border border-stone-200 dark:border-stone-800 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => {
              const dietary = dietaryConfig[item.dietaryTag];
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 8) * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Link
                    to={`/menu/${item.slug}`}
                    className="group bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-orange-900/20 border border-stone-100 dark:border-stone-800 transition-all duration-300 card-lift flex flex-col h-full"
                  >
                  
                  <div className="aspect-[4/3] relative overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {item.isFeatured && (
                      <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 ">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </div>
                    )}

                    {dietary && (
                      <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-sm  ${dietary.color}`}>
                        {dietary.label}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3" /> {item.preparationMinutes} min
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider mb-1.5">
                      {item.categoryId?.name}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.addOns && item.addOns.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 mb-3">
                        <Leaf className="w-3 h-3" />
                        {item.addOns.length} customization{item.addOns.length > 1 ? 's' : ''} available
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-stone-50 dark:border-stone-800 mt-auto">
                      <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                        ${(item.price / 100).toFixed(2)}
                      </span>
                      <span className="bg-stone-900 dark:bg-stone-800 group-hover:bg-orange-600 dark:group-hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-sm transition-colors ">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default Menu;
