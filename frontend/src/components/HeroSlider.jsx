import { useState, useEffect } from 'react';

const slides = [
  { id: 1, title: 'Hotel Exterior', desc: 'Experience the grandeur.', color: 'bg-charcoal-800' },
  { id: 2, title: 'Luxury Rooms', desc: 'Indulge in comfort.', color: 'bg-charcoal-700' },
  { id: 3, title: 'Fine Dining', desc: 'Exquisite vegetarian cuisine.', color: 'bg-charcoal-900' },
  { id: 4, title: 'Events & Weddings', desc: 'Memories created here.', color: 'bg-charcoal-900' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Ken Burns Zoom Effect */}
          <div className={`w-full h-full ${slide.color} animate-ken-burns bg-cover bg-center`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i ? 'bg-gold-400 w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
