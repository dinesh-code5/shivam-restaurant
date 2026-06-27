import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminEnquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data); setOffline(false);
    } catch { setMessages([]); setOffline(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (id, isRead) => {
    try {
      if (!offline) await api.put(`/contact/${id}`, { isRead: !isRead });
      setMessages(p => p.map(m => m._id === id ? {...m, isRead: !isRead} : m));
    } catch { setError('Update failed.'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(id);
    try {
      if (!offline) await api.delete(`/contact/${id}`);
      setMessages(p => p.filter(m => m._id !== id)); setSuccess('Message deleted.');
      if (expanded === id) setExpanded(null);
    } catch { setError('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const handleExpand = async msg => {
    if (expanded === msg._id) { setExpanded(null); return; }
    setExpanded(msg._id);
    if (!msg.isRead) await toggleRead(msg._id, false);
  };

  const filtered = filter === 'All' ? messages : filter === 'Unread' ? messages.filter(m => !m.isRead) : messages.filter(m => m.isRead);
  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Contact Enquiries</h1>
          <p className="font-sans text-xs text-charcoal-400 mt-0.5">{messages.length} total · {unread} unread</p>
        </div>
        <button onClick={fetchData} className="btn-outline dark text-[10px] px-4 py-2">↻ Refresh</button>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Backend offline.</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={()=>setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={()=>setError('')}>✕</button></div>}

      <div className="flex gap-1.5">
        {['All','Unread','Read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 transition-all ${filter===f ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner"/></div> : filtered.length === 0 ? (
        <div className="bg-white border border-cream-200 text-center py-16">
          <p className="font-serif text-lg text-charcoal-300 italic">{offline ? '🔌 Backend offline.' : 'No messages found.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => (
            <div key={msg._id} className={`bg-white border-l-4 border border-cream-200 p-4 hover:border-gold-300 transition-colors ${!msg.isRead ? 'border-l-gold-400' : 'border-l-cream-200'}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gold-gradient flex items-center justify-center font-serif text-charcoal-900 font-semibold text-base flex-shrink-0">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-sans text-sm font-medium ${!msg.isRead ? 'text-charcoal-900' : 'text-charcoal-500'}`}>{msg.name}</p>
                      {!msg.isRead && <span className="font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 bg-gold-50 text-gold-700 border border-gold-200">New</span>}
                    </div>
                    <p className="font-sans text-xs text-charcoal-400">✉️ {msg.email}{msg.phone ? ` · 📞 ${msg.phone}` : ''}</p>
                    {msg.subject && <p className="font-sans text-xs text-charcoal-600 font-medium mt-0.5">{msg.subject}</p>}
                    <p className="font-sans text-[10px] text-charcoal-300 mt-0.5">{new Date(msg.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => handleExpand(msg)}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-cream-100 text-charcoal-600 hover:bg-cream-200 transition-colors">
                    {expanded === msg._id ? 'Hide' : 'Read'}
                  </button>
                  <button onClick={() => toggleRead(msg._id, msg.isRead)}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-gold-50 text-gold-700 border border-gold-200 hover:bg-gold-100 transition-colors">
                    {msg.isRead ? 'Unread' : 'Mark Read'}
                  </button>
                  <button onClick={() => handleDelete(msg._id)} disabled={deletingId === msg._id}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50">
                    {deletingId === msg._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
              {expanded === msg._id && (
                <div className="mt-4 pt-4 border-t border-cream-100">
                  <p className="font-sans text-sm text-charcoal-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <a href={`mailto:${msg.email}?subject=Re: ${msg.subject||'Your Enquiry'}`}
                    className="inline-flex items-center gap-2 mt-3 font-sans text-[10px] tracking-[0.15em] uppercase text-gold-500 hover:text-gold-600 transition-colors">
                    📧 Reply via Email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
