import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';

const STATUS_COLORS = {
  available: 'border-gold-300 bg-white text-black hover:border-gold-500',
  occupied: 'border-red-600 bg-red-50 text-red-900',
  reserved: 'border-amber-400 bg-amber-50 text-amber-900',
  cleaning: 'border-blue-400 bg-blue-50 text-blue-900',
};

const TableCard = ({ table, onClick }) => (
  <div
    onClick={() => onClick(table)}
    className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${STATUS_COLORS[table.status] || 'border-gray-200 bg-white'}`}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="font-display font-bold text-3xl">T{table.number}</span>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${table.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-black text-white'}`}>{table.status}</span>
    </div>
    <p className="text-sm font-semibold mb-1 opacity-70">Capacity: {table.capacity}</p>
    <p className="text-sm font-semibold mb-4 opacity-70">{table.section}</p>
    {table.session ? (
      <div className="bg-black/5 rounded-lg p-3 space-y-1">
        <p className="font-bold truncate text-black">{table.session.customerName}</p>
        <p className="text-xs font-semibold">👥 {table.session.guestCount}</p>
        <p className="font-bold text-lg text-gold-700">₹{table.session.total?.toFixed(2) || '0.00'}</p>
      </div>
    ) : (
      <p className="text-xs font-bold text-black/30 mt-2">— Available —</p>
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
      alert('Bill generated.');
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating bill');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black text-white rounded-t-3xl p-6 flex items-center justify-between border-b-4 border-gold-500">
          <div>
            <h2 className="font-display font-bold text-3xl">Table {table.number}</h2>
            <p className="text-gold-400 text-sm">{table.section} · Capacity: {table.capacity}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-3xl leading-none">✕</button>
        </div>
        
        {loading ? (
            <div className="p-20 text-center">Loading...</div>
        ) : !session ? (
            <div className="p-20 text-center text-xl font-semibold text-gray-500">Table is currently empty.</div>
        ) : (
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {label: 'Subtotal', val: session.subtotal},
                        {label: 'GST', val: session.gstAmount},
                        {label: 'Service', val: session.serviceCharge},
                        {label: 'Grand Total', val: session.total, highlight: true},
                    ].map(s => (
                        <div key={s.label} className={`p-4 rounded-2xl border ${s.highlight ? 'bg-black text-gold-400 border-gold-500' : 'bg-gray-50 border-gray-100'}`}>
                            <p className="text-xs font-bold uppercase opacity-60">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.highlight ? 'text-gold-400' : 'text-black'}`}>₹{s.val?.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4">Item</th>
                                <th className="p-4 text-center">Qty</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {session.orders.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">{item.name}</td>
                                    <td className="p-4 text-center">{item.quantity}</td>
                                    <td className="p-4 text-right">₹{item.price}</td>
                                    <td className="p-4 text-right font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {session.status === 'active' && (
                    <div className="border-t pt-8">
                        <h3 className="font-bold text-lg mb-4">Generate Bill</h3>
                        <div className="flex gap-3">
                            {['cash', 'card', 'upi'].map(m => (
                                <button key={m} onClick={() => handleBill(m)} className="flex-1 py-4 rounded-xl bg-black text-gold-400 font-bold hover:bg-gold-600 hover:text-black transition-all text-lg uppercase tracking-widest border border-gold-500">
                                    {m}
                                </button>
                            ))}
                        </div>
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
  const [offline, setOffline] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      const res = await api.get('/tables');
      setTables(res.data.data);
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  const addTable = async () => {
    const number = prompt('Enter new table number:');
    if (!number) return;
    try {
      await api.post('/tables', { number, capacity: 4, section: 'Main' });
      fetchTables();
    } catch (err) { alert('Failed to add table.'); }
  };

  const removeTable = async (id) => {
    if (!window.confirm('Are you sure you want to remove this table?')) return;
    try {
      await api.delete(`/tables/${id}`);
      fetchTables();
    } catch (err) { alert('Failed to remove table.'); }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-black">Table Management</h1>
        <div className="flex gap-3">
            <button onClick={addTable} className="btn-primary">Add Table</button>
            <button onClick={fetchTables} className="btn-gold">↻ Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tables.map((table) => (
            <div key={table._id} className="relative group">
                <TableCard table={table} onClick={setSelected} />
                <button onClick={() => removeTable(table._id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
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
