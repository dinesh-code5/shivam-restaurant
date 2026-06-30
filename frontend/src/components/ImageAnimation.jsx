import { useState, useEffect } from 'react';

const images = [
  { color: 'bg-gold-500', title: 'Cuisine' },
  { color: 'bg-charcoal-700', title: 'Events' },
  { color: 'bg-cream-400', title: 'Rooms' },
];

export default function ImageAnimation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            active === index ? 'opacity-100' : 'opacity-0'
          } ${img.color} flex items-center justify-center`}
        >
          <span className="font-serif text-2xl text-white tracking-widest">{img.title}</span>
        </div>
      ))}
    </div>
  );
}
