// import { useState, useEffect } from 'react';
// import { Link, NavLink, useLocation } from 'react-router-dom';

// const NAV_LINKS = [
//   { name: 'Home',      path: '/' },
//   { name: 'About',     path: '/about' },
//   { name: 'Rooms',     path: '/reserve-room' },
//   { name: 'Menu',      path: '/menu' },
//   { name: 'Gallery',   path: '/gallery' },
//   { name: 'Contact',   path: '/contact' },
// ];

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);
//   const location = useLocation();
//   const isHome = location.pathname === '/';

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 60);
//     window.addEventListener('scroll', fn, { passive: true });
//     return () => window.removeEventListener('scroll', fn);
//   }, []);

//   useEffect(() => { setOpen(false); }, [location.pathname]);

//   const solid = scrolled || !isHome;

//   return (
//     <>
//       <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         solid 
//           ? 'bg-[rgba(17,17,17,0.92)] backdrop-blur-[18px] shadow-[0_12px_34px_rgba(0,0,0,0.24)]' 
//           : 'bg-[rgba(17,17,17,0.65)] backdrop-blur-[12px]'
//       }`}>
//         <div className="max-w-7xl mx-auto px-6 sm:px-8">
//           <div className="flex items-center justify-between h-16 md:h-20">

//             {/* Logo */}
//             <Link to="/" className="flex flex-col items-start leading-none select-none group">
//               <span className="font-sc text-xl md:text-2xl font-semibold tracking-[0.14em] uppercase text-white transition-colors group-hover:text-gold-400">
//                 Shivam
//               </span>
//               <span className="font-sans text-[9px] tracking-[0.32em] uppercase text-gold-400 -mt-px">
//                 Resort & Restaurant
//               </span>
//             </Link>

//             {/* Desktop links */}
//             <div className="hidden lg:flex items-center gap-8">
//               {NAV_LINKS.map(l => (
//                 <NavLink key={l.path} to={l.path}
//                   className={({ isActive }) =>
//                     `relative font-sans text-[13px] tracking-[0.2em] uppercase transition-colors duration-200 group ${
//                       isActive ? 'text-gold-400' : 'text-white/80 hover:text-gold-400'
//                     }`
//                   }>
//                   {l.name}
//                   <span className="absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 w-0 group-hover:w-full" />
//                 </NavLink>
//               ))}
//             </div>

//             {/* CTA + mobile toggle */}
//             <div className="flex items-center gap-3">
              
//               <Link to="/admin/dashboard"
//                 className="hidden md:inline-flex font-sans text-[12px] tracking-[0.18em] uppercase text-white border border-gold-400/50 px-3 py-1.5 hover:bg-gold-400 hover:text-black transition-all">
//                 Staff →
//               </Link>
//               <button onClick={() => setOpen(!open)}
//                 className="lg:hidden text-white p-1 focus:outline-none" aria-label="Menu">
//                 <span className="block w-5 h-px bg-current mb-1.5 transition-all duration-300" style={{ transform: open ? 'rotate(45deg) translate(4px,4px)' : '' }} />
//                 <span className="block w-5 h-px bg-current mb-1.5 transition-all duration-300" style={{ opacity: open ? 0 : 1 }} />
//                 <span className="block w-5 h-px bg-current transition-all duration-300" style={{ transform: open ? 'rotate(-45deg) translate(4px,-4px)' : '' }} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         <div className={`lg:hidden overflow-hidden transition-all duration-400 ${open ? 'max-h-[28rem]' : 'max-h-0'}`}>
//           <div className="bg-charcoal-950 px-6 pb-6 pt-2 border-t border-gold-400/15 shadow-2xl">
//             {NAV_LINKS.map(l => (
//               <NavLink key={l.path} to={l.path}
//                 className={({ isActive }) =>
//                   `block py-3 border-b border-white/6 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors ${
//                     isActive ? 'text-gold-400' : 'text-white/70 hover:text-gold-400'
//                   }`
//                 }>
//                 {l.name}
//               </NavLink>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* Sticky Mobile Book Now Button */}
//       <Link to="/reserve-room" className="sm:hidden fixed bottom-6 left-6 z-50 btn-primary px-6 py-3 text-[12px] shadow-lg">
//         Book Now
//       </Link>

//       {/* WhatsApp FAB */}
//       <a href="https://wa.me/9057254349?text=Hello%20Shivam%20Resort!"
//         target="_blank" rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300"
//         aria-label="Chat on WhatsApp">
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//           <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-1.749-.872-2.892-1.554-4.042-3.527-.305-.522.305-.483.871-1.61.097-.195.05-.366-.05-.51-.1-.151-.673-1.62-.922-2.218-.247-.6-.5-.518-.673-.526-.171-.008-.366-.01-.56-.01-.196 0-.51.074-.78.367-.27.293-1.04 1.016-1.04 2.479 0 1.463 1.064 2.875 1.213 3.074.149.195 2.052 3.133 5.027 4.27 2.974 1.139 2.974.76 3.396.713.42-.046 1.358-.554 1.546-1.09.187-.534.187-.99.13-1.09-.057-.1-.207-.149-.508-.299z"/>
//           <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.96.555 3.789 1.515 5.336L2 22l4.825-1.466A9.953 9.953 0 0012.004 22C17.527 22 22 17.523 22 12S17.527 2 12.004 2zm0 18.18c-1.694 0-3.32-.46-4.737-1.33l-.34-.21-3.166.962.953-3.18-.222-.355A8.156 8.156 0 013.82 12c0-4.512 3.673-8.18 8.184-8.18 4.51 0 8.183 3.668 8.183 8.18 0 4.512-3.673 8.18-8.183 8.18z"/>
//         </svg>
//       </a>
//     </>
//   );
// }


import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { name: 'Home',    path: '/' },
  { name: 'About',   path: '/about' },
  { name: 'Rooms',   path: '/reserve-room' },
  { name: 'Menu',    path: '/menu' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    // Check immediately on mount
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // On home page: transparent until scrolled. On other pages: always solid.
  const bgClass = !isHome || scrolled
    ? 'bg-charcoal-950/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,162,39,0.15)]'
    : 'bg-transparent';

  return (
    <>
      {/* Fixed navbar — sits above everything */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col items-start leading-none select-none group">
              <span className="font-sc text-xl md:text-2xl font-semibold tracking-[0.14em] uppercase text-white group-hover:text-gold-400 transition-colors">
                Shivam
              </span>
              <span className="font-sans text-[9px] tracking-[0.32em] uppercase text-gold-400 -mt-px">
                Resort & Restaurant
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <NavLink
                  key={l.path}
                  to={l.path}
                  className={({ isActive }) =>
                    `relative font-sans text-[11px] tracking-[0.22em] uppercase transition-colors duration-200 group ${
                      isActive ? 'text-gold-400' : 'text-white/75 hover:text-gold-400'
                    }`
                  }
                >
                  {l.name}
                  {/* Underline hover effect */}
                  <span className="absolute -bottom-1 left-0 h-px bg-gold-400 w-0 group-hover:w-full transition-all duration-300" />
                </NavLink>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin/dashboard"
                className="hidden md:inline-flex font-sans text-[10px] tracking-[0.2em] uppercase text-white/50 border border-gold-400/30 px-3 py-1.5 hover:bg-gold-400 hover:text-charcoal-900 hover:border-gold-400 transition-all duration-200"
              >
                Staff →
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setOpen(p => !p)}
                className="lg:hidden text-white p-1 focus:outline-none"
                aria-label="Toggle menu"
              >
                <span className="block w-5 h-px bg-current mb-1.5 transition-all duration-300"
                  style={{ transform: open ? 'rotate(45deg) translate(4px, 4px)' : '' }} />
                <span className="block w-5 h-px bg-current mb-1.5 transition-all duration-300"
                  style={{ opacity: open ? 0 : 1 }} />
                <span className="block w-5 h-px bg-current transition-all duration-300"
                  style={{ transform: open ? 'rotate(-45deg) translate(4px, -4px)' : '' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
          <div className="bg-charcoal-950 border-t border-gold-400/15 px-6 pt-2 pb-5 space-y-0.5">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) =>
                  `block py-3 border-b border-white/6 font-sans text-[11px] tracking-[0.22em] uppercase transition-colors ${
                    isActive ? 'text-gold-400' : 'text-white/65 hover:text-gold-400'
                  }`
                }
              >
                {l.name}
              </NavLink>
            ))}
            <Link
              to="/admin/dashboard"
              className="block pt-3 font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-gold-400 transition-colors"
            >
              Staff →
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile sticky Book Now */}
      <Link
        to="/reserve-room"
        className="sm:hidden fixed bottom-20 left-4 z-50 btn-primary px-5 py-2.5 text-[11px] shadow-gold-lg"
      >
        Book Now
      </Link>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/9057254349?text=Hello%20Shivam%20Resort!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-1.749-.872-2.892-1.554-4.042-3.527-.305-.522.305-.483.871-1.61.097-.195.05-.366-.05-.51-.1-.151-.673-1.62-.922-2.218-.247-.6-.5-.518-.673-.526-.171-.008-.366-.01-.56-.01-.196 0-.51.074-.78.367-.27.293-1.04 1.016-1.04 2.479 0 1.463 1.064 2.875 1.213 3.074.149.195 2.052 3.133 5.027 4.27 2.974 1.139 2.974.76 3.396.713.42-.046 1.358-.554 1.546-1.09.187-.534.187-.99.13-1.09-.057-.1-.207-.149-.508-.299z"/>
          <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.96.555 3.789 1.515 5.336L2 22l4.825-1.466A9.953 9.953 0 0012.004 22C17.527 22 22 17.523 22 12S17.527 2 12.004 2zm0 18.18c-1.694 0-3.32-.46-4.737-1.33l-.34-.21-3.166.962.953-3.18-.222-.355A8.156 8.156 0 013.82 12c0-4.512 3.673-8.18 8.184-8.18 4.51 0 8.183 3.668 8.183 8.18 0 4.512-3.673 8.18-8.183 8.18z"/>
        </svg>
      </a>
    </>
  );
}