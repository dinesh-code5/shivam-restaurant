import { useEffect, useState } from 'react';
import api from '../../api/axios';

const MOCK = [
  { _id:'1', customerName:'Rahul Sharma', rating:5, review:'Absolutely divine experience. The Shivam Special Thali is unlike anything else in Pali.', visitDate: new Date(), status:'approved', isFeatured:true },
  { _id:'2', customerName:'Priya Mehta',  rating:4, review:'Great ambience and warm hospitality. The Shivam Special Thali is a must-try!', visitDate: new Date(), status:'pending', isFeatured:false },
  { _id:'3', customerName:'Arvind Gupta', rating:5, review:'Best restaurant in Pali! The biryani was outstanding and service was impeccable.', visitDate: new Date(), status:'approved', isFeatured:false },
];

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s<=n ? 'text-gold-400' : 'text-charcoal-100'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback', { params: { status: filter } });
      setFeedbacks(res.data.data); setOffline(false);
    } catch { setFeedbacks(MOCK); setOffline(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const update = async (id, updates) => {
    try {
      if (!offline) await api.put(`/feedback/${id}`, updates);
      setFeedbacks(p => p.map(f => f._id === id ? {...f, ...updates} : f));
      setSuccess('Review updated.');
    } catch { setError('Update failed.'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return;
    try {
      if (!offline) await api.delete(`/feedback/${id}`);
      setFeedbacks(p => p.filter(f => f._id !== id)); setSuccess('Deleted.');
    } catch { setError('Delete failed.'); }
  };

  const avgRating = feedbacks.length ? (feedbacks.reduce((s,f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : '0.0';

  const statusBadge = status => {
    const map = { pending:'bg-amber-50 text-amber-700 border border-amber-200', approved:'bg-green-50 text-green-700 border border-green-200', rejected:'bg-red-50 text-red-700 border border-red-200' };
    return <span className={`font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${map[status]||''}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-light">Feedback & Reviews</h1>
        <p className="font-sans text-xs text-charcoal-400 mt-0.5">{feedbacks.length} reviews · Avg: {avgRating} ★</p>
      </div>

      {offline && <div className="bg-amber-50 border border-amber-200 p-3 font-sans text-xs text-amber-700">⚠️ Demo Mode</div>}
      {success && <div className="bg-green-50 border border-green-200 p-3 font-sans text-xs text-green-700 flex items-center justify-between">{success}<button onClick={()=>setSuccess('')}>✕</button></div>}
      {error && <div className="bg-red-50 border border-red-200 p-3 font-sans text-xs text-red-700 flex items-center justify-between">{error}<button onClick={()=>setError('')}>✕</button></div>}

      {/* Rating overview */}
      <div className="bg-white border border-cream-200 p-5 flex items-center gap-8">
        <div className="text-center flex-shrink-0">
          <p className="font-serif text-6xl text-charcoal-900 font-light">{avgRating}</p>
          <Stars n={Math.round(Number(avgRating))} />
          <p className="font-sans text-[9px] text-charcoal-400 mt-1 tracking-wide">Average Rating</p>
        </div>
        <div className="flex-1 space-y-2">
          {[5,4,3,2,1].map(star => {
            const count = feedbacks.filter(f => f.rating === star).length;
            const pct = feedbacks.length ? Math.round((count / feedbacks.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="font-sans text-charcoal-500 w-5">{star}★</span>
                <div className="flex-1 bg-cream-100 h-1.5">
                  <div className="h-1.5 bg-gold-gradient" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-sans text-charcoal-400 w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-1.5">
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 transition-all capitalize ${filter===f ? 'bg-gold-gradient text-charcoal-900 font-medium' : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><div className="spinner"/></div> : (
        <div className="space-y-4">
          {feedbacks.length === 0 && <p className="text-center font-serif text-lg text-charcoal-300 italic py-12">No reviews found.</p>}
          {feedbacks.map(fb => (
            <div key={fb._id} className="bg-white border border-cream-200 p-5 hover:border-gold-300 transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-sans text-sm font-medium text-charcoal-900">{fb.customerName}</p>
                    {statusBadge(fb.status)}
                    {fb.isFeatured && <span className="font-sans text-[9px] bg-gold-50 text-gold-700 border border-gold-200 px-2 py-0.5">⭐ Featured</span>}
                  </div>
                  <Stars n={fb.rating} />
                  <p className="font-sans text-[10px] text-charcoal-300 mt-0.5">{new Date(fb.visitDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fb.status !== 'approved' && (
                    <button onClick={() => update(fb._id, {status:'approved'})}
                      className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                      ✓ Approve
                    </button>
                  )}
                  {fb.status !== 'rejected' && (
                    <button onClick={() => update(fb._id, {status:'rejected'})}
                      className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                      ✗ Reject
                    </button>
                  )}
                  <button onClick={() => update(fb._id, {isFeatured: !fb.isFeatured})}
                    className={`font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 border transition-colors ${fb.isFeatured ? 'bg-gold-100 text-gold-800 border-gold-300' : 'bg-gold-50 text-gold-600 border-gold-200 hover:bg-gold-100'}`}>
                    {fb.isFeatured ? 'Unfeature' : '★ Feature'}
                  </button>
                  <button onClick={() => handleDelete(fb._id)}
                    className="font-sans text-[10px] tracking-wide uppercase px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              <p className="font-serif text-sm text-charcoal-600 italic leading-relaxed">"{fb.review}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
