import { useState, useEffect } from 'react';

const slides = [
  { 
    id: 1, 
    title: 'OFFERS', 
    title2: '& PROMOTIONS', 
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80',
    desc: 'Experience the grandeur of Rajasthan.' 
  },
  { 
    id: 2, 
    title: 'LUXURIOUS', 
    title2: 'ROOMS & SUITES', 
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1920&q=80',
    desc: 'Indulge in pure comfort and royal amenities.' 
  },
  { 
    id: 3, 
    title: 'FINE VEGETARIAN', 
    title2: '& JAIN DINING', 
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
    desc: 'Authentic flavors crafted with love.' 
  },
  { 
    id: 4, 
    title: 'ROYAL CELEBRATIONS', 
    title2: '& WEDDINGS', 
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80',
    desc: 'Create unforgettable memories in our grand halls.' 
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-charcoal-950">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Ken Burns Zoom Effect */}
          {current === index && (
            <div 
              className="w-full h-full animate-ken-burns bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          )}
        </div>
      ))}
      
      {/* Luxury Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-2" />
      
      {/* Dynamic Text Overlay in bottom-left corner to match Taj Hotels */}
      <div className="absolute bottom-28 left-6 md:left-12 lg:left-24 z-10 text-left max-w-2xl select-none">
        <h2 className="font-serif text-4xl md:text-6xl lg:text-[70px] font-light tracking-wider uppercase leading-[1.1] text-white">
          <span className="flex items-center gap-3 md:gap-4">
            <span className="w-8 md:w-16 h-[1.5px] bg-white/70 inline-block align-middle" />
            <span className="opacity-95">{slides[current].title}</span>
          </span>
          <span className="block pl-[44px] md:pl-[80px] opacity-95 mt-1">{slides[current].title2}</span>
        </h2>
        <p className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-gold-300 uppercase mt-4 pl-[44px] md:pl-[80px] font-semibold opacity-90">
          {slides[current].desc}
        </p>
      </div>

      {/* Slide Pagination Dots */}
      <div className="absolute bottom-28 right-6 md:right-12 lg:right-24 flex gap-3.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === i ? 'bg-gold-400 scale-125 w-6' : 'bg-white/40 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
