import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

const BG_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80";
const CATEGORIES = ['All','Starters','Soups','Main Course','Breads','Rice & Biryani','Desserts','Beverages','Specials'];

export default function Menu() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [jainOnly, setJainOnly] = useState(false);

  useEffect(() => {
    api.get('/menu')
      .then(res => setItems((res.data.data || []).filter(i => i.type !== 'Non-Veg')))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => {
    const catMatch = activeCategory === 'All' || i.category === activeCategory;
    const vegMatch = i.type === 'Veg' || i.type === 'Vegan';
    const jainMatch = !jainOnly || vegMatch;
    return catMatch && vegMatch && jainMatch && i.isAvailable !== false;
  });

  const grouped = filtered.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative text-white pt-[64px] md:pt-[80px]"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/82 z-0 pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* QR Table Banner */}
        {tableNumber && (
          <div className="fixed top-[64px] md:top-[80px] left-0 right-0 z-40 bg-gold-gradient py-2.5 text-center shadow-lg">
            <p className="font-sans text-xs font-semibold text-charcoal-900 tracking-wide">
              📱 Viewing menu for <strong>Table {tableNumber}</strong> — Your waiter will take your order
            </p>
          </div>
        )}

        {/* Header */}
        <section className={`relative overflow-hidden ${tableNumber ? 'pt-40' : 'pt-32'} pb-20`}>
          <div className="container-lux relative z-10 text-center">
            <p className="eyebrow text-gold-400 mb-4">Veg & Jain Friendly</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white mb-4">Our Menu</h1>
            <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
            <p className="font-serif text-lg text-cream-100/70 italic max-w-xl mx-auto">
              Crafted with the finest ingredients. Rooted in Rajasthani tradition.
            </p>
          </div>
        </section>

        {/* Sticky category filter bar — Translucent Dark */}
        <div className={`sticky ${tableNumber ? 'top-[140px] md:top-[150px]' : 'top-[68px] md:top-[100px]'} z-30 border-t border-b border-white/5 backdrop-blur-md`}>
          <div className="container-lux">
            <div className="flex items-center gap-1 overflow-x-auto py-3.5 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 font-sans text-[11px] tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200 ${
                    activeCategory === cat ? 'bg-gold-gradient text-charcoal-900 font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              {/* Jain Switcher */}
              <div className="flex-shrink-0 ml-auto pl-4 border-l border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap">
                  <div 
                    onClick={() => setJainOnly(!jainOnly)}
                    className={`w-9 h-5 rounded-full transition-all duration-300 relative cursor-pointer ${jainOnly ? 'bg-gold-400' : 'bg-white/15'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${jainOnly ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-white/60 font-semibold select-none">Jain Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Menu content list */}
        <section className="py-14 md:py-20">
          <div className="container-lux">
            {loading ? (
              <div className="flex justify-center py-20"><div className="spinner" /></div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-[22px] text-white/50 italic font-light">No items found for the selected filters.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(grouped).map(([category, catItems]) => (
                  <div key={category}>
                    {/* Category heading */}
                    <div className="flex items-center gap-6 mb-8">
                      <div>
                        <p className="eyebrow text-[13px] text-gold-400 mb-1">{category}</p>
                        <div className="h-px w-14 bg-gold-400" />
                      </div>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {catItems.map((item, i) => (
                        <Reveal key={item._id} delay={i * 0.06}>
                          <div className="glass-luxury border border-white/10 p-5 hover:border-gold-400/40 hover:shadow-luxury transition-all duration-300 group h-full flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 border-green-500 bg-green-500/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  </div>
                                  <span className="font-sans text-[10px] font-bold tracking-wider text-green-400 uppercase">
                                    {item.type === 'Vegan' ? 'Jain' : 'Veg'}
                                  </span>
                                </div>
                                <p className="font-serif text-[20px] text-gold-400 font-light">₹{item.price}</p>
                              </div>
                              <h3 className="font-serif text-lg text-white font-medium mb-2 group-hover:text-gold-400 transition-colors">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="font-sans text-xs text-white/60 font-light leading-relaxed mb-4">{item.description}</p>
                              )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/40">{item.category}</p>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dietary note */}
        <div className="bg-charcoal-950/80 border-t border-white/5 py-8 backdrop-blur-sm">
          <div className="container-lux flex flex-wrap items-center gap-6 justify-center text-center sm:text-left sm:justify-start">
            <div className="flex items-center gap-2 bg-green-950/20 border border-green-800/35 px-3 py-1.5">
              <div className="w-3 h-3 border border-green-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <span className="font-sans text-[10px] font-bold text-green-400 uppercase tracking-wide">Pure Vegetarian</span>
            </div>
            <span className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-amber-400 border border-amber-500/30 px-3 py-1.5 bg-amber-500/5">Jain Friendly</span>
            <p className="font-sans text-xs text-white/45 italic">Prices inclusive of applicable taxes. Subject to seasonal availability.</p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
