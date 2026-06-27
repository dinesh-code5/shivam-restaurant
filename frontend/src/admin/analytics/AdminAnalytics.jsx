import { useEffect, useState } from 'react';
import api from '../../api/axios';

const MOCK = {
  revenue: { today: 14580, week: 98450, month: 387200 },
  customers: { total: 342, returning: 189, newToday: 12 },
  avgRating: '4.3',
  mostOrdered: [
    { name: 'Shivam Special Thali', count: 89 },
    { name: 'Dal Makhani', count: 72 },
    { name: 'Paneer Butter Masala', count: 65 },
    { name: 'Chicken Biryani', count: 58 },
    { name: 'Mango Lassi', count: 47 },
  ],
  roomBookings: 28,
  occupancyRate: 55,
};

function StatCard({ label, value, sub, icon, gold = false }) {
  return (
    <div className={`p-5 border ${gold ? 'bg-gold-gradient border-transparent' : 'bg-white border-cream-200'}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <p className={`font-serif text-3xl font-light ${gold ? 'text-charcoal-900' : 'text-charcoal-900'}`}>{value}</p>
      <p className={`font-sans text-[10px] tracking-[0.12em] uppercase mt-1 ${gold ? 'text-charcoal-700' : 'text-charcoal-400'}`}>{label}</p>
      {sub && <p className={`font-sans text-[10px] mt-0.5 ${gold ? 'text-charcoal-600' : 'text-charcoal-300'}`}>{sub}</p>}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    api.get('/analytics')
      .then(res => { setData(res.data.data); setOffline(false); })
      .catch(() => { setData(MOCK); setOffline(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"/></div>;

  const d = data;
  const retention = d.customers.total > 0 ? Math.round((d.customers.returning / d.customers.total) * 100) : 0;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Analytics</h1>
        <p className="font-sans text-xs text-charcoal-400 mt-0.5">Live business insights for Shivam Resort & Restaurant</p>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Demo Mode — showing sample analytics data.</div>}

      {/* Revenue */}
      <div>
        <p className="eyebrow text-charcoal-300 mb-3">Revenue</p>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Today's Revenue" value={`₹${d.revenue.today.toLocaleString('en-IN')}`} icon="💰" gold />
          <StatCard label="Weekly Revenue"   value={`₹${d.revenue.week.toLocaleString('en-IN')}`} icon="📅" />
          <StatCard label="Monthly Revenue"  value={`₹${d.revenue.month.toLocaleString('en-IN')}`} icon="📆" />
        </div>
      </div>

      {/* Customers */}
      <div>
        <p className="eyebrow text-charcoal-300 mb-3">Customers</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Customers"     value={d.customers.total}     icon="👥" />
          <StatCard label="Returning Customers" value={d.customers.returning} sub={`${retention}% rate`} icon="🔄" gold />
          <StatCard label="New Today"           value={d.customers.newToday}  icon="✨" />
          <StatCard label="Avg Rating"          value={`${d.avgRating} ★`}   icon="⭐" />
        </div>
      </div>

      {/* Operations */}
      <div>
        <p className="eyebrow text-charcoal-300 mb-3">Operations</p>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Room Bookings"  value={d.roomBookings}        icon="🏨" />
          <StatCard label="Occupancy Rate" value={`${d.occupancyRate}%`} icon="📊" />
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="bg-white border border-cream-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-serif text-base text-charcoal-900">Occupancy Rate</p>
          <p className="font-serif text-2xl text-gold-500 font-light">{d.occupancyRate}%</p>
        </div>
        <div className="w-full bg-cream-100 h-2">
          <div className="h-2 bg-gold-gradient transition-all duration-1000" style={{ width: `${d.occupancyRate}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-sans text-[9px] text-charcoal-300">0%</span>
          <span className="font-sans text-[9px] text-charcoal-300">100%</span>
        </div>
      </div>

      {/* Most ordered */}
      <div className="bg-white border border-cream-200 p-5">
        <p className="font-serif text-base text-charcoal-900 mb-5">Most Ordered Dishes</p>
        <div className="space-y-4">
          {d.mostOrdered.map((item, i) => {
            const max = d.mostOrdered[0]?.count || 1;
            const pct = Math.round((item.count / max) * 100);
            return (
              <div key={item.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-sans text-xs text-charcoal-700">
                    <span className="text-gold-500 font-medium mr-1.5">#{i+1}</span>{item.name}
                  </span>
                  <span className="font-sans text-xs text-charcoal-400">{item.count} orders</span>
                </div>
                <div className="w-full bg-cream-100 h-1.5">
                  <div className="h-1.5 bg-gold-gradient" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer donut */}
      <div className="bg-white border border-cream-200 p-5">
        <p className="font-serif text-base text-charcoal-900 mb-5">Customer Breakdown</p>
        <div className="flex items-center gap-10">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F4EDD6" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C9A227" strokeWidth="3.5"
                strokeDasharray={`${retention} ${100 - retention}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-xl text-charcoal-900 font-light">{retention}%</span>
              <span className="font-sans text-[9px] text-charcoal-400 tracking-wide">returning</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { color: 'bg-gold-400', label: 'Returning', val: d.customers.returning },
              { color: 'bg-cream-300', label: 'New', val: d.customers.total - d.customers.returning },
              { color: 'bg-charcoal-800', label: 'Total', val: d.customers.total },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 ${item.color} flex-shrink-0`} />
                <span className="font-sans text-xs text-charcoal-600">{item.label}: <strong className="font-medium">{item.val}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
