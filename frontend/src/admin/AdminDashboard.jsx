import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MOCK = {
  totalMenuItems: 28, totalTableReservations: 0, pendingTableReservations: 0,
  totalRoomReservations: 0, pendingRoomReservations: 0, totalMessages: 0, unreadMessages: 0,
  recentTableReservations: [], recentRoomReservations: [], recentMessages: [],
  pendingPayments: 0,
};

const STATUS = {
  Pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-green-50 text-green-700 border border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
  Completed: 'bg-blue-50 text-blue-700 border border-blue-200',
};

function StatCard({ label, value, sub, icon, gold = false, link }) {
  const inner = (
    <div className={`p-6 border transition-shadow hover:shadow-lg ${gold ? 'bg-gold-gradient border-transparent' : 'bg-white border-cream-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        {link && <span className={`font-sans text-sm ${gold ? 'text-black' : 'text-charcoal-400'}`}>→</span>}
      </div>
      <p className={`font-serif text-4xl font-bold ${gold ? 'text-black' : 'text-black'}`}>{value}</p>
      <p className={`font-sans text-xs font-semibold tracking-[0.1em] uppercase mt-2 ${gold ? 'text-black/70' : 'text-charcoal-600'}`}>{label}</p>
      {sub && <p className={`font-sans text-xs mt-1 ${gold ? 'text-black/60' : 'text-charcoal-400'}`}>{sub}</p>}
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : <div>{inner}</div>;
}

export default function AdminDashboard() {
  const [data, setData] = useState(MOCK);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => { setData(res.data.data); setOffline(false); })
      .catch(() => { setData(MOCK); setOffline(true); })
      .finally(() => setLoading(false));
      
    // Simulate incoming request popup
    setTimeout(() => {
        // Only show if there's actually something to verify
        setShowPopup(true);
    }, 5000);
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="font-sans text-xs text-charcoal-400">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-7">
      {/* Payment Notification Popup */}
      {showPopup && (
        <div className="fixed top-20 right-5 z-50 bg-white border border-gold-400 shadow-xl p-4 w-80 animate-fade-in">
          <p className="font-sans text-sm font-semibold text-charcoal-900">New Payment Request!</p>
          <p className="text-xs text-charcoal-600 mt-1 mb-3">A new payment is pending verification.</p>
          <div className="flex gap-2">
            <Link to="/admin/billing" onClick={() => setShowPopup(false)} className="btn-primary text-[10px] px-3 py-1.5 flex-1 text-center">Verify Now</Link>
            <button onClick={() => setShowPopup(false)} className="btn-outline dark text-[10px] px-3 py-1.5">Dismiss</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Dashboard</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">Welcome back · Shivam Resort & Restaurant</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/tables" className="btn-primary text-[10px] px-4 py-2">Live Tables</Link>
          <Link to="/admin/kitchen" className="btn-outline dark text-[10px] px-4 py-2">Kitchen View</Link>
          <Link to="/waiter" className="btn-outline dark text-[10px] px-4 py-2">Waiter View</Link>
        </div>
      </div>

      {offline && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <span className="text-amber-500">⚠️</span>
          <div>
            <p className="font-sans text-xs font-semibold text-amber-800">Backend Offline — Demo Mode</p>
            <p className="font-sans text-xs text-amber-700 mt-0.5">
              Start MongoDB + backend to see live data. Run <code className="bg-amber-100 px-1">npm run dev</code> in the backend folder.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div>
        <p className="eyebrow text-charcoal-300 mb-3">Overview</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard label="Menu Items" value={data.totalMenuItems} icon="🍽️" gold link="/admin/menu" />
          <StatCard label="Table Bookings" value={data.totalTableReservations} sub={`${data.pendingTableReservations} pending`} icon="📅" link="/admin/table-reservations" />
          <StatCard label="Room Bookings" value={data.totalRoomReservations} sub={`${data.pendingRoomReservations} pending`} icon="🏨" link="/admin/room-reservations" />
          <StatCard label="Enquiries" value={data.totalMessages} sub={`${data.unreadMessages} unread`} icon="✉️" link="/admin/enquiries" />
          <StatCard label="Payments" value={data.pendingPayments} sub="Pending Verification" icon="💳" link="/admin/billing" />
        </div>
      </div>

      {/* Alerts */}
      {(data.pendingTableReservations > 0 || data.pendingRoomReservations > 0 || data.unreadMessages > 0 || data.pendingPayments > 0) && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-sans text-xs font-semibold text-amber-800">Attention Required</p>
            <p className="font-sans text-xs text-amber-700 mt-0.5">
              {data.pendingTableReservations > 0 && `${data.pendingTableReservations} table bookings pending · `}
              {data.pendingRoomReservations > 0 && `${data.pendingRoomReservations} room bookings pending · `}
              {data.unreadMessages > 0 && `${data.unreadMessages} unread messages · `}
              {data.pendingPayments > 0 && `${data.pendingPayments} payments pending verification`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/table-reservations" className="font-sans text-[10px] tracking-[0.1em] uppercase bg-amber-600 text-white px-3 py-1.5 hover:bg-amber-700 transition-colors">Tables</Link>
            <Link to="/admin/enquiries" className="font-sans text-[10px] tracking-[0.1em] uppercase bg-amber-600 text-white px-3 py-1.5 hover:bg-amber-700 transition-colors">Enquiries</Link>
            <Link to="/admin/billing" className="font-sans text-[10px] tracking-[0.1em] uppercase bg-amber-600 text-white px-3 py-1.5 hover:bg-amber-700 transition-colors">Payments</Link>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        {[
          { title:'Recent Table Bookings', data: data.recentTableReservations, link:'/admin/table-reservations', empty:'No table bookings yet.',
            render: r => ({ primary: r.name, secondary: `${r.date} · ${r.time} · ${r.guests} guests`, status: r.status }) },
          { title:'Recent Room Bookings', data: data.recentRoomReservations, link:'/admin/room-reservations', empty:'No room bookings yet.',
            render: r => ({ primary: r.name, secondary: `${r.roomType} · ${r.checkIn} → ${r.checkOut}`, status: r.status }) },
          { title:'Recent Messages', data: data.recentMessages, link:'/admin/enquiries', empty:'No messages yet.',
            render: m => ({ primary: m.name, secondary: m.subject || m.message?.slice(0,40), status: m.isRead ? null : 'Unread' }) },
        ].map(col => (
          <div key={col.title} className="bg-white border border-cream-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="font-serif text-base text-charcoal-900">{col.title}</p>
              <Link to={col.link} className="font-sans text-[9px] tracking-[0.1em] uppercase text-gold-500 hover:text-gold-600">View All</Link>
            </div>
            <div className="space-y-3">
              {col.data.length === 0 ? (
                <p className="font-sans text-xs text-charcoal-300 text-center py-5 italic">{col.empty}</p>
              ) : col.data.map((item, i) => {
                const { primary, secondary, status } = col.render(item);
                return (
                  <div key={i} className="flex items-start justify-between gap-2 pb-3 border-b border-cream-100 last:border-0 last:pb-0">
                    <div className="min-w-0 flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-gold-gradient flex-shrink-0 flex items-center justify-center font-serif text-charcoal-900 font-semibold text-sm mt-0.5">
                        {primary.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-xs font-medium text-charcoal-800 truncate">{primary}</p>
                        <p className="font-sans text-[10px] text-charcoal-400 truncate">{secondary}</p>
                      </div>
                    </div>
                    {status && (
                      <span className={`font-sans text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 flex-shrink-0 ${STATUS[status] || 'bg-gold-50 text-gold-700 border border-gold-200'}`}>
                        {status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-cream-200 p-5">
        <p className="font-serif text-base text-charcoal-900 mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-2.5">
          {[
            { label:'+ Add Menu Item', href:'/admin/menu', gold: true },
            { label:'Table Reservations', href:'/admin/table-reservations' },
            { label:'Room Bookings', href:'/admin/room-reservations' },
            { label:'Invoices', href:'/admin/billing' },
            { label:'Feedback', href:'/admin/feedback' },
            { label:'WhatsApp Templates', href:'/admin/whatsapp' },
            { label: 'Analytics', href: '/admin/analytics' },
            { label:'home', href:'/' },
          ].map(a => (
            <Link key={a.href} to={a.href}
              className={a.gold ? 'btn-primary text-[10px] px-4 py-2' : 'btn-outline dark text-[10px] px-4 py-2'}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
