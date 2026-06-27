import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/admin/dashboard',         label: 'Dashboard',         icon: '📊' },
  { path: '/admin/analytics',         label: 'Analytics',         icon: '📈' },
  { divider: 'Restaurant' },
  { path: '/admin/tables',            label: 'Table Management',  icon: '🪑' },
  { path: '/admin/kitchen',           label: 'Kitchen (KOT)',     icon: '🍳' },
  { path: '/admin/billing',           label: 'Billing & Invoices',icon: '🧾' },
  { path: '/admin/menu',              label: 'Manage Menu',       icon: '🍽️' },
  { divider: 'Reservations' },
  { path: '/admin/table-reservations',label: 'Table Bookings',    icon: '📅' },
  { path: '/admin/room-reservations', label: 'Room Bookings',     icon: '🏨' },
  { path: '/admin/rooms',             label: 'Manage Rooms',      icon: '🛏️' },
  { divider: 'Customers' },
  { path: '/admin/feedback',          label: 'Feedback & Reviews',icon: '⭐' },
  { path: '/admin/whatsapp',          label: 'WhatsApp',          icon: '💬' },
  { path: '/admin/enquiries',         label: 'Enquiries',         icon: '✉️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-cream-100">
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-charcoal-900 z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto border-r border-gold-400/10`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/6 flex items-center justify-between">
          <div>
            <p className="font-sc text-lg text-white tracking-[0.12em] uppercase">Shivam</p>
            <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold-400 -mt-0.5">Admin Panel</p>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white text-lg leading-none" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
          {NAV.map((item, i) =>
            item.divider ? (
              <p key={i} className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/20 px-3 pt-5 pb-1.5">{item.divider}</p>
            ) : (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-[11px] font-sans tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-gradient text-charcoal-900 font-medium'
                      : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`
                }>
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/6 space-y-2">
          <div className="flex items-center gap-2.5 px-1 mb-3">
            <div className="w-7 h-7 bg-gold-gradient flex items-center justify-center font-serif text-charcoal-900 font-semibold text-sm flex-shrink-0">
              {(user?.name || 'A').charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[11px] font-sans font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-white/30 text-[9px] font-sans truncate">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center font-sans text-[9px] tracking-[0.12em] uppercase py-1.5 text-white/25 hover:text-gold-400 transition-colors">
              Site ↗
            </a>
            <a href="/waiter" target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center font-sans text-[9px] tracking-[0.12em] uppercase py-1.5 text-white/25 hover:text-gold-400 transition-colors">
              Waiter ↗
            </a>
            <button onClick={() => { logout(); navigate('/admin/login'); }}
              className="flex-1 text-center font-sans text-[9px] tracking-[0.12em] uppercase py-1.5 text-red-400/70 hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-cream-200 h-12 flex items-center justify-between px-5 sticky top-0 z-10 shadow-sm">
          <button className="lg:hidden p-1 text-charcoal-700" onClick={() => setOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-sc text-sm font-semibold text-charcoal-900 tracking-wide">Shivam Resort & Restaurant</span>
          <div className="font-sans text-[10px] text-charcoal-300">
            {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric' })}
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
