import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

const GALLERY = [
  { id:1, label:'Grand Courtyard', category:'Resort', col:'col-span-2 row-span-2' },
  { id:2, label:'Signature Thali', category:'Dining' },
  { id:3, label:'Premium Suite', category:'Rooms' },
  { id:4, label:'Banquet Setup', category:'Events', row:'row-span-2' },
  { id:5, label:'Garden Seating', category:'Resort' },
  { id:6, label:'Paneer Tikka', category:'Dining' },
  { id:7, label:'Deluxe Room', category:'Rooms', col:'col-span-2' },
  { id:8, label:'Wedding Decor', category:'Events' },
  { id:9, label:"Chef's Kitchen", category:'Dining' },
  { id:10, label:'Courtyard View', category:'Resort', col:'col-span-2' },
  { id:11, label:'Family Room', category:'Rooms' },
  { id:12, label:'Dessert Display', category:'Dining' },
];
const FILTERS = ['All','Resort','Dining','Rooms','Events'];
const GLOW = ['from-amber-900/50','from-gold-700/35','from-stone-800/50','from-zinc-900/50'];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const items = filter === 'All' ? GALLERY : GALLERY.filter(g => g.category === filter);

  return (
    <>
      <Navbar />

      <section className="bg-charcoal-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="container-lux relative z-10 text-center">
          <p className="eyebrow text-gold-400 mb-4">Visual Journey</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white mb-4">Gallery</h1>
          <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
          <p className="font-serif text-lg text-cream-100/55 italic">A glimpse into the world of Shivam Resort & Restaurant</p>
        </div>
      </section>

      {/* Filter */}
      <div className="bg-white border-b border-cream-200 sticky top-16 md:top-20 z-30">
        <div className="container-lux flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 font-sans text-[10px] tracking-[0.2em] uppercase px-5 py-2 transition-all duration-200 ${
                filter === f ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'text-charcoal-400 hover:text-charcoal-800'
              }`}>
              {f}
            </button>
          ))}
          <span className="ml-auto font-sans text-[10px] text-charcoal-300 tracking-wide whitespace-nowrap">{items.length} images</span>
        </div>
      </div>

      {/* Masonry grid */}
      <section className="py-10 md:py-14 bg-ivory">
        <div className="container-lux">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5" style={{gridAutoRows:'180px'}}>
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}
                className={`relative overflow-hidden bg-charcoal-800 cursor-pointer group ${item.col || ''} ${item.row || ''}`}
                style={{ gridRow: item.col?.includes('row-span-2') ? 'span 2' : item.row === 'row-span-2' ? 'span 2' : 'span 1' }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${GLOW[i % GLOW.length]} to-transparent`} />
                <div className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity duration-500 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 100 100" fill="rgba(201,162,39,0.9)">
                    <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-all duration-400 flex items-end p-4"
                  onClick={() => setLightbox(item.id)}>
                  <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="eyebrow text-gold-400 text-[8px]">{item.category}</p>
                    <p className="font-serif text-base text-white">{item.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <div className="bg-charcoal-900 py-14 text-center">
        <div className="container-lux max-w-xl mx-auto">
          <p className="eyebrow text-gold-400 mb-3">Follow Our Journey</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mb-4">@shivam_resort_pali</h2>
          <p className="font-sans text-sm text-cream-100/40 font-light mb-6">
            Follow us on Instagram for the latest updates, moments and special offers.
          </p>
          <a href="https://www.instagram.com/shivam_resort_pali" target="_blank" rel="noopener noreferrer"
            className="btn-primary inline-flex">
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-charcoal-950/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-2xl">✕</button>
          <div className="w-full max-w-3xl aspect-video bg-charcoal-800 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,162,39,0.1),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              {(() => {
                const item = GALLERY.find(g => g.id === lightbox);
                return (
                  <div className="text-center">
                    <svg width="70" height="70" viewBox="0 0 100 100" className="mx-auto mb-4" style={{fill:'rgba(201,162,39,0.25)'}}>
                      <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                    </svg>
                    <p className="font-serif text-2xl text-white">{item?.label}</p>
                    <p className="eyebrow text-gold-400 mt-2">{item?.category}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
