import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';

const STATUS_STYLES = {
  new: { bg: 'bg-red-50 border-red-300', badge: 'bg-red-500 text-white', label: 'NEW' },
  preparing: { bg: 'bg-amber-50 border-amber-300', badge: 'bg-amber-500 text-white', label: 'PREPARING' },
  ready: { bg: 'bg-green-50 border-green-300', badge: 'bg-green-600 text-white', label: 'READY' },
  served: { bg: 'bg-gray-50 border-gray-200', badge: 'bg-gray-400 text-white', label: 'SERVED' },
};

const NEXT_STATUS = { new: 'preparing', preparing: 'ready', ready: 'served' };

const KOTCard = ({ kot, onUpdate }) => {
  const style = STATUS_STYLES[kot.status] || STATUS_STYLES.new;
  const elapsed = Math.floor((Date.now() - new Date(kot.createdAt)) / 60000);

  return (
    <div className={`rounded-xl border-2 ${style.bg} p-4 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
            {kot.isAdditional && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">ADD-ON</span>}
          </div>
          <p className="font-display font-bold text-xl text-charcoal-900 mt-1">Table {kot.tableNumber}</p>
          <p className="text-xs text-charcoal-500">{kot.kotNumber} · {elapsed}m ago</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-charcoal-400">Waiter</p>
          <p className="text-sm font-semibold text-charcoal-800">{kot.waiterName || '—'}</p>
        </div>
      </div>

      <div className="space-y-2">
        {kot.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between bg-white/60 rounded-lg px-3 py-2">
            <div>
              <p className="font-semibold text-sm text-charcoal-900">{item.name}</p>
              {item.notes && <p className="text-xs text-charcoal-400 italic">"{item.notes}"</p>}
            </div>
            <span className="font-display font-bold text-lg text-charcoal-900 ml-3">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {kot.status !== 'served' && (
        <button
          onClick={() => onUpdate(kot._id, NEXT_STATUS[kot.status])}
          className="w-full py-2.5 rounded-lg bg-charcoal-900 text-gold-300 font-semibold text-sm hover:bg-charcoal-800 transition-colors"
        >
          Mark as {NEXT_STATUS[kot.status]?.toUpperCase()} →
        </button>
      )}
    </div>
  );
};

const MOCK_KOTS = [
  { _id: '1', kotNumber: 'KOT-001', tableNumber: 3, waiterName: 'Ravi', status: 'new', isAdditional: false, createdAt: new Date(Date.now() - 5 * 60000), items: [{ name: 'Paneer Tikka', quantity: 2, notes: 'Less spicy' }, { name: 'Butter Naan', quantity: 4, notes: '' }] },
  { _id: '2', kotNumber: 'KOT-002', tableNumber: 7, waiterName: 'Suresh', status: 'preparing', isAdditional: false, createdAt: new Date(Date.now() - 12 * 60000), items: [{ name: 'Laal Maas', quantity: 1, notes: '' }, { name: 'Jeera Rice', quantity: 2, notes: '' }] },
  { _id: '3', kotNumber: 'KOT-003', tableNumber: 3, waiterName: 'Ravi', status: 'ready', isAdditional: true, createdAt: new Date(Date.now() - 20 * 60000), items: [{ name: 'Mango Lassi', quantity: 2, notes: '' }] },
];

const KitchenKOT = () => {
  const [kots, setKots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState('active');

  const fetchKOTs = useCallback(async () => {
    try {
      const params = filter === 'active' ? {} : { status: filter };
      const res = await api.get('/kot', { params });
      setKots(res.data.data);
      setOffline(false);
    } catch {
      setKots(MOCK_KOTS);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchKOTs();
    const iv = setInterval(fetchKOTs, 15000);
    return () => clearInterval(iv);
  }, [fetchKOTs]);

  const updateStatus = async (id, status) => {
    try {
      if (offline) {
        setKots((prev) => prev.map((k) => k._id === id ? { ...k, status } : k));
        return;
      }
      await api.put(`/kot/${id}/status`, { status });
      fetchKOTs();
    } catch (err) {
      alert('Failed to update KOT status');
    }
  };

  const displayed = filter === 'active' ? kots.filter((k) => k.status !== 'served') : kots.filter((k) => k.status === filter);

  const counts = {
    new: kots.filter((k) => k.status === 'new').length,
    preparing: kots.filter((k) => k.status === 'preparing').length,
    ready: kots.filter((k) => k.status === 'ready').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Kitchen Dashboard</h1>
          <p className="text-charcoal-400 text-sm">Kitchen Order Tickets · Auto-refreshes every 15s</p>
        </div>
        <button onClick={fetchKOTs} className="btn-outline-dark text-sm px-3 py-2">↻ Refresh</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex gap-2">⚠️ <strong>Demo Mode</strong> — showing sample KOTs.</div>}

      {/* Status counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-display font-bold text-red-600">{counts.new}</p>
          <p className="text-xs text-red-500 font-semibold mt-1">🔴 New</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-display font-bold text-amber-600">{counts.preparing}</p>
          <p className="text-xs text-amber-500 font-semibold mt-1">🟡 Preparing</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-display font-bold text-green-600">{counts.ready}</p>
          <p className="text-xs text-green-500 font-semibold mt-1">🟢 Ready</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['active', 'new', 'preparing', 'ready', 'served'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${filter === f ? 'bg-gold-gradient text-charcoal-900 border-transparent font-semibold' : 'border-gold-300 text-charcoal-700 hover:bg-gold-50'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner"></div></div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 card-luxury">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-charcoal-500">No active KOTs. Kitchen is clear!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((kot) => (
            <KOTCard key={kot._id} kot={kot} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenKOT;
