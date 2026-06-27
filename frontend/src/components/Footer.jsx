import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-cream-100 border-t border-gold-400/20">
      <div className="container-lux py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div>
            <div className="mb-5">
              <p className="font-sc text-2xl font-semibold tracking-[0.14em] uppercase text-white">Shivam</p>
              <p className="font-sans text-[8px] tracking-[0.32em] uppercase text-gold-400 mt-0.5">Resort & Restaurant</p>
            </div>
            <p className="font-sans text-xs font-light leading-relaxed text-cream-100/55 mb-5">
              A new experience. A new destination. Royal Rajasthani hospitality meets exquisite pure veg dining and luxury stays in Pali.
            </p>
            <p className="eyebrow text-gold-500/60 text-[9px] mb-3">Est. 2026</p>
            <a href="https://www.instagram.com/shivam_resort_pali" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[10px] tracking-wide text-cream-100/40 hover:text-gold-400 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @shivam_resort_pali
            </a>
          </div>

          {/* Explore */}
          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3">
              {[['Home','/'],['About Us','/about'],['Our Rooms','/reserve-room'],['Restaurant','/menu'],['Gallery','/gallery']].map(([l,h]) => (
                <li key={h}>
                  <Link to={h} className="font-sans text-xs font-light text-cream-100/50 hover:text-gold-400 transition-colors tracking-wide">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reservations */}
          <div>
            <p className="eyebrow mb-5">Reservations</p>
            <ul className="space-y-3">
              {[['Book a Room','/reserve-room'],['Reserve a Table','/reserve-table'],['Contact Us','/contact'],['Admin Login','/admin/login'],['Waiter Panel','/waiter']].map(([l,h]) => (
                <li key={h}>
                  <Link to={h} className="font-sans text-xs font-light text-cream-100/50 hover:text-gold-400 transition-colors tracking-wide">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Find Us</p>
            <ul className="space-y-4">
              {[
                ['📍','Jodhpur Road, Ghumti, Pali, Rajasthan'],
                ['📞','+91 00000 00000'],
                ['✉️','info@shivamresort.com'],
                ['🕐','Restaurant: 7am – 11pm\nReception: 24 hours'],
              ].map(([icon, val]) => (
                <li key={val} className="flex items-start gap-3">
                  <span className="text-gold-400 text-sm flex-shrink-0 mt-0.5">{icon}</span>
                  <span className="font-sans text-xs font-light text-cream-100/50 leading-relaxed whitespace-pre-line">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] tracking-wide text-cream-100/25">
            © {new Date().getFullYear()} Shivam Resort & Restaurant. All rights reserved.
          </p>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold-500/50">
            Est. 2026 · Pali, Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
}
