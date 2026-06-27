import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

const CATEGORIES = ['All','Starters','Soups','Main Course','Breads','Rice & Biryani','Desserts','Beverages','Specials'];

export default function Menu() {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [jainOnly, setJainOnly] = useState(false);

  useEffect(() => {
    api.get('/menu').then(res => setItems((res.data.data || []).filter(i => i.type !== 'Non-Veg'))).catch(() => setItems([])).finally(() => setLoading(false));
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
    <>
      <Navbar />

      {/* QR Banner */}
      {tableNumber && (
        <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gold-gradient py-2.5 text-center">
          <p className="font-sans text-xs font-medium text-charcoal-900 tracking-wide">
            📱 Viewing menu for <strong>Table {tableNumber}</strong> — Your waiter will take your order
          </p>
        </div>
      )}

      {/* Header */}
      <section className={`bg-charcoal-900 relative overflow-hidden ${tableNumber ? 'pt-36' : 'pt-32'} pb-20`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,162,39,0.12),transparent_60%)]" />
        <div className="container-lux relative z-10 text-center">
          <p className="eyebrow text-gold-400 mb-4">Veg & Jain Friendly</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white mb-4">Our Menu</h1>
          <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
          <p className="font-serif text-lg text-cream-100/55 italic max-w-xl mx-auto">
            Crafted with the finest ingredients. Rooted in Rajasthani tradition.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-cream-200 shadow-sm">
        <div className="container-lux">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 font-sans text-[10px] tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200 ${
                  activeCategory === cat ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'text-charcoal-400 hover:text-charcoal-800'
                }`}>
                {cat}
              </button>
            ))}
            <div className="flex-shrink-0 ml-auto pl-4 border-l border-cream-200">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <div onClick={() => setJainOnly(!jainOnly)}
                  className={`w-9 h-5 rounded-full transition-all duration-300 relative cursor-pointer ${jainOnly ? 'bg-gold-400' : 'bg-cream-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${jainOnly ? 'left-4' : 'left-0.5'}`} />
                </div>
                <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-500">Jain</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Menu content */}
      <section className="py-14 md:py-20 bg-ivory">
        <div className="container-lux">
          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner" /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-charcoal-400 italic">No items found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(grouped).map(([category, catItems]) => (
                <div key={category}>
                  {/* Category heading */}
                  <div className="flex items-center gap-6 mb-8">
                    <div>
                      <p className="eyebrow text-gold-500 mb-1">{category}</p>
                      <div className="h-px w-14 bg-gold-300" />
                    </div>
                    <div className="flex-1 h-px bg-cream-200" />
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catItems.map((item, i) => (
                      <Reveal key={item._id} delay={i * 0.06}>
                        <div className="bg-white border border-cream-200 p-5 hover:border-gold-300 hover:shadow-[0_8px_32px_rgba(201,162,39,0.08)] transition-all duration-400 group h-full flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 border-green-600">
                                <div className="w-2 h-2 rounded-full bg-green-600" />
                              </div>
                              <span className="font-sans text-[10px] font-semibold tracking-wide text-green-700">{item.type === 'Vegan' ? 'Jain' : 'Veg'}</span>
                            </div>
                            <p className="font-serif text-xl text-gold-500">₹{item.price}</p>
                          </div>
                          <h3 className="font-serif text-lg text-charcoal-900 font-medium mb-2 group-hover:text-gold-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="font-sans text-xs text-charcoal-400 font-light leading-relaxed flex-1">{item.description}</p>
                          )}
                          <div className="mt-4 pt-4 border-t border-cream-100">
                            <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal-300">{item.category}</p>
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
      <div className="bg-cream-100 border-t border-cream-200 py-7">
        <div className="container-lux flex flex-wrap items-center gap-5 justify-center text-center sm:text-left sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600" />
            </div>
            <span className="font-sans text-xs text-charcoal-500">Pure Vegetarian</span>
          </div>
          <span className="font-sans text-[9px] tracking-[0.1em] uppercase text-amber-600 border border-amber-300 px-2 py-0.5">Jain Friendly</span>
          <p className="font-sans text-xs text-charcoal-400 italic">Prices inclusive of applicable taxes. Subject to seasonal availability.</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
