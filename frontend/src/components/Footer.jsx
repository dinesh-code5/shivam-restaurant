import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950/80 text-cream-100 border-t border-gold-500/10 backdrop-blur-md relative z-10">
      <div className="container-lux py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">

          {/* Brand & Logo */}
          <div className="flex flex-col items-start">
            <div className="mb-6">
              <Logo light={true} size="md" />
            </div>
            <p className="font-sans text-xs font-light leading-relaxed text-cream-100/50 mb-6 max-w-sm">
              Royal Rajasthani hospitality meets exquisite pure vegetarian dining and luxury stays in Pali, Rajasthan. A premium resort designed for celebrations and retreats.
            </p>
            <a 
              href="https://www.instagram.com/shivam_resort_pali" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-sans text-[10px] tracking-widest uppercase text-white/50 hover:text-gold-400 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span>Instagram</span>
            </a>
          </div>

          {/* Explore Links */}
          <div>
            <p className="eyebrow text-gold-400 mb-6 text-[10px] tracking-[0.2em] font-semibold">Explore</p>
            <ul className="space-y-3.5">
              {[
                ['Home', '/'],
                ['About Us', '/about'],
                ['Accommodations', '/reserve-room'],
                ['Dining Menu', '/menu'],
                ['Visual Gallery', '/gallery']
              ].map(([l, h]) => (
                <li key={h}>
                  <Link 
                    to={h} 
                    className="font-sans text-[12px] text-white/50 hover:text-gold-400 transition-all duration-300 hover:translate-x-1 transform inline-block tracking-wide"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking / Staff Links */}
          <div>
            <p className="eyebrow text-gold-400 mb-6 text-[10px] tracking-[0.2em] font-semibold">Reservations</p>
            <ul className="space-y-3.5">
              {[
                ['Book a Room', '/reserve-room'],
                ['Reserve a Table', '/reserve-table'],
                ['Contact Us', '/contact'],
                ['Staff Dashboard', '/admin/login'],
                ['Waiter Panel', '/waiter']
              ].map(([l, h]) => (
                <li key={h}>
                  <Link 
                    to={h} 
                    className="font-sans text-[12px] text-white/50 hover:text-gold-400 transition-all duration-300 hover:translate-x-1 transform inline-block tracking-wide"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <p className="eyebrow text-gold-400 mb-6 text-[10px] tracking-[0.2em] font-semibold">Find Us</p>
            <ul className="space-y-4">
              {[
                ['📍', 'Jodhpur Road, Ghumti, Pali, Rajasthan'],
                ['📞', '+91 90572 54349'],
                ['✉️', 'info@shivamresort.com'],
                ['🕐', 'Restaurant: 7am – 11pm\nReception: 24 hours'],
              ].map(([icon, val]) => (
                <li key={val} className="flex items-start gap-3">
                  <span className="text-gold-400 text-sm flex-shrink-0 mt-0.5">{icon}</span>
                  <span className="font-sans text-[12px] font-light text-white/50 leading-relaxed whitespace-pre-line tracking-wide">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Stamp */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] tracking-wide text-white/30">
            © {new Date().getFullYear()} Shivam Resort & Restaurant. All rights reserved.
          </p>
          <p className="font-serif text-[12px] italic tracking-wide text-gold-400/50 select-none">
            "Hospitality is not a service — it is a feeling."
          </p>
        </div>
      </div>
    </footer>
  );
}
