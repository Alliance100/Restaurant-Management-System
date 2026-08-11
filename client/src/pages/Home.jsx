import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, ChefHat, Leaf, Flame, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, catRes] = await Promise.all([
          api.get('/menu-items?limit=50'),
          api.get('/categories'),
        ]);
        const allItems = itemsRes.data.data || [];
        const featuredItems = allItems.filter(i => i.isFeatured).slice(0, 6);
        setFeatured(featuredItems.length > 0 ? featuredItems : allItems.slice(0, 6));
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dietaryColor = (tag) => {
    const map = {
      vegetarian: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
      vegan: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
      'non-vegetarian': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
      'gluten-free': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    };
    return map[tag] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400';
  };

  return (
    <PageTransition>
      <div className="overflow-x-hidden bg-white dark:bg-stone-950 transition-colors duration-200">
        <section className="relative min-h-[calc(100dvh-64px)] py-12 lg:py-0 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-sm blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-600/20 rounded-sm blur-3xl" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-pink-600/10 rounded-sm blur-3xl" />

          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85"
                alt="Delicious food spread"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/60 to-transparent" />
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-center lg:text-left order-2 lg:order-1 pt-8 lg:pt-0"
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm text-white/80 text-sm font-medium mb-8">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Award-winning Dining Experience</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-4 animate-fade-in-up delay-100">
                  Crafted with <span className="gradient-text">passion</span>,<br />
                  served with love
                </h1>

                <p className="max-w-md lg:max-w-lg xl:max-w-xl text-base md:text-lg lg:text-xl text-stone-300 leading-relaxed mb-8 animate-fade-in-up delay-200">
                  Experience excellence cusine with fresh, locally-sourced ingredients.
                  Every dish tells a story — yours starts here.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                  <Link
                    to="/menu"
                    className="group inline-flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-none border border-stone-200 dark:border-stone-800 shadow-lg shadow-orange-900/50 btn-glow transition-all text-base sm:text-lg"
                  >
                    Explore Our Menu
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-none border border-stone-200 dark:border-stone-800 transition-all text-base sm:text-lg"
                  >
                    Join TableCraft
                  </Link>
                </div>
              </motion.div>


            </div>
          </div>


        </section>

        <section className="py-20 bg-white dark:bg-stone-950">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 mb-4">
                Why Choose <span className="gradient-text">TableCraft</span>?
              </h2>
              <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-lg">
                We're obsessed with quality — from the farm to your plate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ChefHat, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30', title: 'Expert Chefs', desc: 'Award-winning culinary artists who craft every dish with passion and precision.' },
                { icon: Leaf, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', title: 'Fresh Ingredients', desc: 'Locally sourced, seasonal produce and premium meats — delivered daily.' },
                { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', title: 'Fast Service', desc: 'From kitchen to table in 15 minutes or less. Quality at speed.' },
                { icon: Star, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', title: 'Top Rated', desc: 'Consistently rated 4.9 stars by thousands of happy customers.' },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className={`card-lift bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-8 border border-stone-100 dark:border-stone-800  text-center`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className={`w-14 h-14 ${f.bg} rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`w-7 h-7 ${f.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">{f.title}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="py-20 bg-stone-50 dark:bg-stone-900">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 mb-2">
                    Browse by <span className="gradient-text">Category</span>
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400">Find exactly what you're craving.</p>
                </div>
                <Link to="/menu" className="hidden md:flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:gap-3 transition-all">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat, i) => (
                  <Link
                    key={cat._id}
                    to={`/menu?category=${cat.slug}`}
                    className="group relative rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden aspect-square card-lift  border border-stone-100 dark:border-stone-800"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <img
                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-white font-bold text-sm">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-stone-950">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider mb-3">
                  <Flame className="w-3 h-3" /> Chef's Picks
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 mb-2">
                  Featured <span className="gradient-text">Dishes</span>
                </h2>
                <p className="text-stone-500 dark:text-stone-400">Handpicked favourites our chefs are proud of.</p>
              </div>
              <Link to="/menu" className="hidden md:flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:gap-3 transition-all">
                Full menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
                    <div className="skeleton aspect-[4/3] opacity-50" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-4 w-2/3 rounded opacity-50" />
                      <div className="skeleton h-3 w-full rounded opacity-50" />
                      <div className="skeleton h-3 w-4/5 rounded opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Link
                      to={`/menu/${item.slug}`}
                      className="group bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-2xl border border-stone-100 dark:border-stone-800 transition-all duration-300 card-lift flex flex-col h-full"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.isFeatured && (
                          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1 ">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </div>
                        )}
                        {item.dietaryTag && item.dietaryTag !== 'none' && (
                          <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-sm capitalize  ${dietaryColor(item.dietaryTag)}`}>
                            {item.dietaryTag}
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                          {item.categoryId?.name}
                        </div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4 flex-1">{item.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-50 dark:border-stone-800 mt-auto">
                          <span className="text-xl font-black text-stone-900 dark:text-stone-100">${(item.price / 100).toFixed(2)}</span>
                          <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                            <Clock className="w-3 h-3" /> {item.preparationMinutes} min
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
