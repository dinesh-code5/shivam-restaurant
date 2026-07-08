import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/admin/dashboard',         label: 'Dashboard',         icon: '📊' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/waiter', label: 'Waiter Panel', icon: '👨‍🍳' },
  { divider: 'Restaurant' },
  { path: '/admin/tables',            label: 'Table Management',  icon: '🪑' ,notification: true  },
  { path: '/admin/kitchen',           label: 'Kitchen (KOT)',     icon: '🍳' , notification: true  },
  { path: '/admin/billing',           label: 'Billing & Invoices',icon: '🧾' , notification: true  },
  { path: '/admin/menu',              label: 'Manage Menu',       icon: '🍽️' , notification: true },
  { divider: 'Reservations' },
  { path: '/admin/table-reservations',label: 'Table Bookings',    icon: '📅' , notification: true },
  { path: '/admin/room-reservations', label: 'Room Bookings',     icon: '🏨' , notification: true  },
  { path: '/admin/rooms',             label: 'Manage Rooms',      icon: '🛏️' , notification: true  },
  { divider: 'Customers' },
  { path: '/admin/feedback',          label: 'Feedback & Reviews',icon: '⭐' },
  { path: '/admin/whatsapp',          label: 'WhatsApp',          icon: '💬' },
  { path: '/admin/enquiries',         label: 'Enquiries',         icon: '✉️', notification: true },
  { path: '/',         label: 'Home',         icon: '', notification: true },
  
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hasNewEnquiries, setHasNewEnquiries] = useState(true); // Simulate new notifications

  return (
    <div className="min-h-screen flex bg-cream-100">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar - Responsive: hidden on small, fixed on mobile open, static on large */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-charcoal-900 z-50 flex flex-col transition-transform duration-300 
        ${open ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-auto border-r border-gold-400/10 shadow-xl lg:shadow-none`}>
        
        {/* Logo/Close Area */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-sc text-lg text-white tracking-[0.15em] uppercase">Shivam</p>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold-400 mt-1">Admin Panel</p>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white p-2" onClick={() => setOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {NAV.map((item, i) =>
            item.divider ? (
              <p key={i} className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 px-4 pt-6 pb-2">{item.divider}</p>
            ) : (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 text-sm font-sans transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'bg-gold-gradient text-black font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }>
                <span className="text-xl relative">{item.icon}
                  {item.notification && hasNewEnquiries && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-charcoal-900" />
                  )}
                </span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={() => { logout(); navigate('/admin/login'); }}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 font-sans text-xs font-bold uppercase tracking-wider py-2">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-cream-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <button className="lg:hidden p-2 text-charcoal-700 hover:bg-cream-100 rounded-lg" onClick={() => setOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-sc text-sm font-semibold text-charcoal-900 tracking-widest uppercase">Management</span>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
