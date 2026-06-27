import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';

const STATUS_COLORS = {
  available: 'bg-green-100 border-green-300 text-green-800',
  occupied: 'bg-red-100 border-red-300 text-red-800',
  reserved: 'bg-amber-100 border-amber-300 text-amber-800',
  cleaning: 'bg-blue-100 border-blue-300 text-blue-800',
};

const STATUS_DOT = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  reserved: 'bg-amber-500',
  cleaning: 'bg-blue-500',
};

const TableCard = ({ table, onClick }) => (
  <div
    onClick={() => onClick(table)}
    className={`rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-gold hover:-translate-y-0.5 ${STATUS_COLORS[table.status]}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-display font-bold text-xl">T{table.number}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${STATUS_DOT[table.status]}`}></div>
        <span className="text-[10px] font-semibold uppercase tracking-wide">{table.status}</span>
      </div>
    </div>
    <p className="text-xs opacity-70 mb-2">Cap: {table.capacity} · {table.section}</p>
    {table.session ? (
      <div className="text-xs space-y-0.5">
        <p className="font-semibold truncate">{table.session.customerName}</p>
        <p>👥 {table.session.guestCount} guests</p>
        <p className="font-bold text-sm">₹{table.session.total?.toFixed(2) || '0.00'}</p>
        <p className="opacity-60">{table.session.waiterName}</p>
      </div>
    ) : (
      <p className="text-xs opacity-50 mt-2">— Empty —</p>
    )}
  </div>
);

const SessionModal = ({ table, onClose, onRefresh }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/tables/${table._id}/session`);
        setSession(res.data.data);
      } catch {}
      setLoading(false);
    };
    const fetchQR = async () => {
      try {
        const res = await api.get(`/tables/${table._id}/qr`);
        setQrCode(res.data.qrCode);
      } catch {}
    };
    fetchSession();
    fetchQR();
  }, [table._id]);

  const handleBill = async (method) => {
    if (!window.confirm(`Generate bill with ${method} payment?`)) return;
    try {
      await api.post(`/tables/${table._id}/session/bill`, { paymentMethod: method });
      alert('Bill generated. Payment is pending admin verification; the table will remain occupied until approved.');
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating bill');
    }
  };

  const statusColor = { pending: 'text-amber-600', preparing: 'text-blue-600', ready: 'text-green-600', served: 'text-charcoal-400' };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-cream-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-charcoal-900 text-cream-50 rounded-t-2xl p-4 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl">Table {table.number}</h2>
            <p className="text-gold-300 text-xs">{table.section} · Cap: {table.capacity}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQR(!showQR)} className="text-xs px-3 py-1.5 rounded bg-gold-gradient text-charcoal-900 font-semibold">
              {showQR ? 'Hide QR' : 'QR Code'}
            </button>
            <button onClick={onClose} className="text-cream-100/70 hover:text-cream-50 text-xl leading-none">✕</button>
          </div>
        </div>

        {showQR && qrCode && (
          <div className="p-4 text-center border-b border-gold-200 bg-cream-100">
            <img src={qrCode} alt="Table QR" className="w-40 h-40 mx-auto border-4 border-gold-300 rounded-xl" />
            <p className="text-xs text-charcoal-400 mt-2">Scan to view menu</p>
            <p className="text-xs font-mono text-charcoal-500">Table {table.number}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner"></div></div>
        ) : !session ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">🪑</p>
            <p className="text-charcoal-500">Table is available. No active session.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Customer info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Customer', value: session.customerName },
                { label: 'Phone', value: session.customerPhone },
                { label: 'DOB', value: session.customerDOB || '—' },
                { label: 'Guests', value: session.guestCount },
                { label: 'Waiter', value: session.waiterName || '—' },
                { label: 'Status', value: session.status },
              ].map((f) => (
                <div key={f.label} className="bg-cream-100 rounded-lg p-3">
                  <p className="text-[10px] text-charcoal-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-semibold text-charcoal-900 truncate">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Orders */}
            <div>
              <h3 className="font-display font-semibold text-charcoal-900 mb-2">Current Order</h3>
              {session.orders.length === 0 ? (
                <p className="text-charcoal-400 text-sm">No items ordered yet.</p>
              ) : (
                <div className="rounded-xl border border-gold-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-charcoal-900 text-gold-300 text-xs">
                        <th className="text-left px-3 py-2">Item</th>
                        <th className="text-center px-3 py-2">Qty</th>
                        <th className="text-right px-3 py-2">Price</th>
                        <th className="text-right px-3 py-2">Total</th>
                        <th className="text-center px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {session.orders.map((item, i) => (
                        <tr key={i} className="hover:bg-cream-100">
                          <td className="px-3 py-2">
                            <p className="font-medium">{item.name}</p>
                            {item.notes && <p className="text-xs text-charcoal-400">{item.notes}</p>}
                          </td>
                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">₹{item.price}</td>
                          <td className="px-3 py-2 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`text-[10px] font-semibold capitalize ${statusColor[item.status] || ''}`}>{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bill summary */}
            <div className="bg-charcoal-900 rounded-xl p-4 text-cream-50">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-cream-100/70">Subtotal</span>
                <span>₹{session.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cream-100/70">GST ({session.gstRate}%)</span>
                <span>₹{session.gstAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gold-400/30 pt-2">
                <span className="text-gold-300">Total</span>
                <span className="text-gold-300">₹{session.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Generate bill */}
            {session.status === 'active' && session.orders.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-charcoal-700 mb-2">Generate Bill — Payment Method:</p>
                <div className="flex flex-wrap gap-2">
                  {['cash', 'card', 'upi'].map((m) => (
                    <button key={m} onClick={() => handleBill(m)}
                      className="px-4 py-2 rounded-lg bg-gold-gradient text-charcoal-900 font-semibold text-sm capitalize hover:shadow-gold transition-all">
                      {m === 'upi' ? 'UPI' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {session.status === 'billed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
                ✅ Bill has been generated. Invoice sent to customer.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTable, setNewTable] = useState({ number: '', capacity: 4, section: 'Main Hall' });
  const [offline, setOffline] = useState(false);

  const MOCK_TABLES = Array.from({ length: 10 }, (_, i) => ({
    _id: `mock-${i + 1}`, number: i + 1, capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
    section: i < 5 ? 'Main Hall' : 'Garden Area',
    status: i === 1 ? 'occupied' : i === 3 ? 'reserved' : 'available',
    session: i === 1 ? { customerName: 'Rahul Sharma', guestCount: 3, total: 1250, waiterName: 'Ravi' } : null,
    qrCode: '',
  }));

  const fetchTables = useCallback(async () => {
    try {
      const res = await api.get('/tables');
      setTables(res.data.data);
      setOffline(false);
    } catch {
      setTables(MOCK_TABLES);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchTables]);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tables', newTable);
      setShowAdd(false);
      setNewTable({ number: '', capacity: 4, section: 'Main Hall' });
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating table');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Table Management</h1>
          <p className="text-charcoal-400 text-sm">Live table status · Auto-refreshes every 30s</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchTables} className="btn-outline-dark text-sm px-3 py-2">↻ Refresh</button>
          <button onClick={() => setShowAdd(true)} className="btn-gold text-sm">+ Add Table</button>
        </div>
      </div>

      {offline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-center gap-2">
          ⚠️ <strong>Demo Mode</strong> — Connect backend to see live table data.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Tables', value: stats.total, color: 'bg-charcoal-900 text-gold-300' },
          { label: 'Available', value: stats.available, color: 'bg-green-600 text-white' },
          { label: 'Occupied', value: stats.occupied, color: 'bg-red-600 text-white' },
          { label: 'Reserved', value: stats.reserved, color: 'bg-amber-500 text-white' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-3xl font-display font-bold">{s.value}</p>
            <p className="text-xs opacity-80 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add table form */}
      {showAdd && (
        <div className="card-luxury p-5">
          <h3 className="font-display font-semibold text-charcoal-900 mb-4">Add New Table</h3>
          <form onSubmit={handleAddTable} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="label-field">Table Number</label>
              <input type="number" className="input-field w-32" value={newTable.number}
                onChange={(e) => setNewTable((p) => ({ ...p, number: e.target.value }))} required />
            </div>
            <div>
              <label className="label-field">Capacity</label>
              <select className="input-field w-28" value={newTable.capacity}
                onChange={(e) => setNewTable((p) => ({ ...p, capacity: Number(e.target.value) }))}>
                {[2, 4, 6, 8, 10].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Section</label>
              <input className="input-field w-40" value={newTable.section}
                onChange={(e) => setNewTable((p) => ({ ...p, section: e.target.value }))} />
            </div>
            <button type="submit" className="btn-gold">Create Table</button>
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline-dark">Cancel</button>
          </form>
        </div>
      )}

      {/* Table grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner"></div></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <TableCard key={table._id} table={table} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <SessionModal table={selected} onClose={() => setSelected(null)} onRefresh={fetchTables} />
      )}
    </div>
  );
};

export default AdminTables;
