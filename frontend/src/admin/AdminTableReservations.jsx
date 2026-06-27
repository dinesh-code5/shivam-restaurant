import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUSES = ['All','Pending','Confirmed','Cancelled','Completed'];
const STATUS_STYLE = {
  Pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-green-50 text-green-700 border border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border border-red-200',
  Completed: 'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function AdminTableReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== 'All' ? { status: filterStatus } : {};
      const res = await api.get('/reservations/table', { params });
      setReservations(res.data.data); setOffline(false);
    } catch { setReservations([]); setOffline(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/reservations/table/${id}`, { status });
      setSuccess(`Marked as ${status}.`);
      setReservations(p => p.map(r => r._id === id ? {...r, status} : r));
    } catch { setError('Update failed.'); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this reservation?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/reservations/table/${id}`);
      setReservations(p => p.filter(r => r._id !== id)); setSuccess('Deleted.');
    } catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const pending = reservations.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Table Reservations</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">{reservations.length} records{pending > 0 && ` · ${pending} pending`}</p>
        </div>
        <button onClick={fetchData} className="btn-outline dark text-[10px] px-4 py-2">↻ Refresh</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Backend offline — no data to display.</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={() => setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={() => setError('')}>✕</button></div>}

      {/* Status filter */}
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 transition-all ${
              filterStatus === s ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner" /></div> : reservations.length === 0 ? (
        <div className="bg-white border border-cream-200 text-center py-16">
          <p className="font-serif text-lg text-charcoal-300 italic">{offline ? '🔌 Backend offline.' : 'No reservations found.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => (
            <div key={r._id} className="bg-white border border-cream-200 p-4 hover:border-gold-300 transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gold-gradient flex items-center justify-center font-serif text-charcoal-900 font-semibold text-base flex-shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-sans text-sm font-medium text-charcoal-800">{r.name}</p>
                      <span className={`font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${STATUS_STYLE[r.status] || ''}`}>{r.status}</span>
                    </div>
                    <p className="font-sans text-xs text-charcoal-400 mt-0.5">📅 {r.date} at {r.time} · 👥 {r.guests} guests</p>
                    <p className="font-sans text-xs text-charcoal-400">📞 {r.phone}{r.email ? ` · ${r.email}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-cream-100 text-charcoal-600 hover:bg-cream-200 transition-colors">
                    {expanded === r._id ? 'Hide' : 'Details'}
                  </button>
                  <button onClick={() => handleDelete(r._id)} disabled={deletingId === r._id}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50">
                    {deletingId === r._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>

              {expanded === r._id && (
                <div className="mt-4 pt-4 border-t border-cream-100 space-y-3">
                  {r.occasion && <p className="font-sans text-xs text-charcoal-500">🎉 Occasion: {r.occasion}</p>}
                  {r.specialRequest && <p className="font-sans text-xs text-charcoal-500">📝 {r.specialRequest}</p>}
                  <p className="font-sans text-[10px] text-charcoal-400">Submitted: {new Date(r.createdAt).toLocaleString('en-IN')}</p>
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-400 mb-2">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Pending','Confirmed','Cancelled','Completed'].map(s => (
                        <button key={s} onClick={() => updateStatus(r._id, s)} disabled={r.status === s || updatingId === r._id}
                          className={`font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 border transition-colors disabled:opacity-40 ${
                            r.status === s ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'border-charcoal-200 text-charcoal-600 hover:bg-cream-100'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
