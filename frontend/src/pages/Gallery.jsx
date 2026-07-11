import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

const BG_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80";

const GALLERY = [
  { id: 1, label: 'Grand Courtyard', category: 'Resort', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', col: 'col-span-2 row-span-2' },
  { id: 2, label: 'Signature Thali', category: 'Dining', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 3, label: 'Premium Suite', category: 'Rooms', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
  { id: 4, label: 'Banquet Setup', category: 'Events', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', row: 'row-span-2' },
  { id: 5, label: 'Garden Seating', category: 'Resort', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  { id: 6, label: 'Paneer Tikka', category: 'Dining', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 7, label: 'Deluxe Room', category: 'Rooms', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', col: 'col-span-2' },
  { id: 8, label: 'Wedding Decor', category: 'Events', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { id: 9, label: "Chef's Kitchen", category: 'Dining', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { id: 10, label: 'Courtyard View', category: 'Resort', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', col: 'col-span-2' },
  { id: 11, label: 'Family Room', category: 'Rooms', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
  { id: 12, label: 'Dessert Display', category: 'Dining', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
];

const FILTERS = ['All', 'Resort', 'Dining', 'Rooms', 'Events'];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const items = filter === 'All' ? GALLERY : GALLERY.filter(g => g.category === filter);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative text-white pt-[64px] md:pt-[80px]"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/82 z-0 pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <section className="pt-36 pb-20 relative overflow-hidden">
          <div className="container-lux relative z-10 text-center">
            <p className="eyebrow text-gold-400 mb-4">Visual Journey</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white mb-4">Gallery</h1>
            <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
            <p className="font-serif text-lg text-white italic">A glimpse into the world of Shivam Resort & Restaurant</p>
          </div>
        </section>

        {/* Filter sticky bar */}
        <div className="border-t border-b border-white/5 sticky top-[68px] md:top-[100px] z-30 backdrop-blur-md">
          <div className="container-lux flex items-center gap-1 py-3.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 font-sans text-[11px] tracking-[0.2em] uppercase px-5 py-2 transition-all duration-200 ${
                  filter === f ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto font-sans text-[10px] text-white/40 tracking-wider whitespace-nowrap hidden sm:block">{items.length} images</span>
          </div>
        </div>

        {/* Masonry grid */}
        <section className="py-14 md:py-20">
          <div className="container-lux">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" style={{gridAutoRows:'200px'}}>
              {items.map((item, i) => (
                <Reveal 
                  key={item.id} 
                  delay={i * 0.05}
                  className={`relative overflow-hidden bg-charcoal-900 cursor-pointer group border border-white/5 ${item.col || ''} ${item.row || ''}`}
                  style={{ gridRow: item.col?.includes('row-span-2') ? 'span 2' : item.row === 'row-span-2' ? 'span 2' : 'span 1' }}
                >
                  {/* Photo content */}
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Hover gradient layer */}
                  <div className="absolute inset-0 bg-charcoal-950/40 group-hover:bg-charcoal-950/60 transition-all duration-400" />
                  
                  {/* Bottom details visible on hover */}
                  <div 
                    className="absolute inset-0 flex items-end p-5 z-10"
                    onClick={() => setLightbox(item.id)}
                  >
                    <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="eyebrow text-gold-400 text-[8px] mb-1">{item.category}</p>
                      <p className="font-serif text-lg text-white font-medium">{item.label}</p>
                    </div>
                  </div>
                  
                  {/* Shadow overlay to make text pop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <div className="bg-charcoal-950/70 border-t border-white/5 py-16 text-center backdrop-blur-sm">
          <div className="container-lux max-w-xl mx-auto">
            <p className="eyebrow text-gold-400 mb-3">Follow Our Journey</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mb-4">@shivam_resort_pali</h2>
            <p className="font-sans text-sm text-white/50 font-light mb-6">
              Follow us on Instagram for the latest updates, moments and special offers.
            </p>
            <a 
              href="https://www.instagram.com/shivam_resort_pali" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-taj-gold py-3.5 px-8 inline-flex"
            >
              Follow on Instagram
            </a>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightbox && (
          <div 
            className="fixed inset-0 bg-charcoal-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button 
              onClick={() => setLightbox(null)} 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-2xl"
              aria-label="Close lightbox"
            >
              ✕
            </button>
            <div 
              className="w-full max-w-4xl aspect-video bg-charcoal-900 border border-white/10 relative overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              {(() => {
                const item = GALLERY.find(g => g.id === lightbox);
                return (
                  <>
                    <img src={item?.image} alt={item?.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-left">
                      <p className="font-serif text-2xl text-white font-light">{item?.label}</p>
                      <p className="eyebrow text-gold-400 mt-1.5">{item?.category}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
