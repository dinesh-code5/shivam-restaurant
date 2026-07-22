import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

const NAV_LINKS = [
  { name: 'Home',     path: '/' },
  { name: 'About',    path: '/about' },
  { name: 'Rooms',    path: '/reserve-room' },
  { name: 'Dining',   path: '/menu' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact',  path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      const id = path.substring(2);
      if (location.pathname === '/') {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Scroll or other pages: fully transparent background with thin line & blur. Home top: transparent.
  const bgClass = !isHome || scrolled
    ? 'bg-transparent border-b border-white/10 backdrop-blur-md py-2.5 md:py-4 shadow-md'
    : 'bg-transparent py-4 md:py-6';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Logo light={true} size="sm" />
            </Link>

            {/* Desktop Menu links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map(l => (
                <NavLink
                  key={l.path}
                  to={l.path}
                  onClick={(e) => handleNavClick(e, l.path)}
                  className={({ isActive }) =>
                    `relative font-sans text-[11px] xl:text-[12px] tracking-[0.2em] uppercase transition-colors duration-300 group ${
                      isActive && !l.path.includes('#') ? 'text-gold-400 font-semibold' : 'text-white/85 hover:text-gold-400'
                    }`
                  }
                >
                  {l.name}
                  {/* Thin gold underline indicator on hover */}
                  <span className="absolute -bottom-1 left-0 h-px bg-gold-400 w-0 group-hover:w-full transition-all duration-300" />
                </NavLink>
              ))}
            </div>

            {/* Right side CTA actions */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                to="/admin/login"
                className="font-sans text-[11px] xl:text-[12px] tracking-[0.2em] uppercase text-white/85 hover:text-gold-400 transition-colors"
              >
                STAFF LOGIN
              </Link>
              
              <Link
                to="/reserve-room"
                className="btn-taj-gold rounded-none"
              >
                BOOK A STAY
              </Link>
            </div>

            {/* Hamburger button for mobile */}
            <button
              onClick={() => setOpen(p => !p)}
              className="lg:hidden text-white p-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="block w-5.5 h-px bg-current mb-1.5 transition-all duration-300"
                style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : '' }} />
              <span className="block w-5.5 h-px bg-current mb-1.5 transition-all duration-300"
                style={{ opacity: open ? 0 : 1 }} />
              <span className="block w-5.5 h-px bg-current transition-all duration-300"
                style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : '' }} />
            </button>
          </div>
        </div>

        {/* Mobile drawer menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[420px]' : 'max-h-0'}`}>
          <div className="bg-charcoal-950/95 backdrop-blur-lg border-t border-gold-500/10 px-6 pt-2 pb-6 space-y-1">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.path}
                to={l.path}
                onClick={(e) => { handleNavClick(e, l.path); setOpen(false); }}
                className={({ isActive }) =>
                  `block py-3 border-b border-white/5 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors ${
                    isActive && !l.path.includes('#') ? 'text-gold-400 font-semibold' : 'text-white/70 hover:text-gold-400'
                  }`
                }
              >
                {l.name}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              className="block py-3 border-b border-white/5 font-sans text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-gold-400 transition-colors"
            >
              STAFF LOGIN
            </Link>
            <div className="pt-4">
              <Link
                to="/reserve-room"
                className="block text-center btn-taj-gold rounded-none py-3"
              >
                BOOK A STAY
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Button and Mobile sticky Book button */}
      <Link
        to="/reserve-room"
        className="sm:hidden fixed bottom-6 left-6 z-50 btn-taj-gold text-[10px] py-3.5 px-6 shadow-luxury"
      >
        BOOK A STAY
      </Link>
    </>
  );
}