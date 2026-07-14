import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

let userInteracted = false;

const enableAudio = () => {
  userInteracted = true;
  window.removeEventListener('click', enableAudio);
  window.removeEventListener('keydown', enableAudio);
  window.removeEventListener('touchstart', enableAudio);
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', enableAudio);
  window.addEventListener('keydown', enableAudio);
  window.addEventListener('touchstart', enableAudio);
}

const NotificationBell = () => {
  const [notifs, setNotifs] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInitial = useRef(true);
  const audioRef = useRef(new Audio('/bell.wav'));

  const [lastCount, setLastCount] = useState(0);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      const newNotifs = res.data.data || [];
      const newCount = res.data.count || 0;
      
      // Only play sound if new notifications arrived and the total count increased
      if (!isInitial.current && newCount > lastCount) {
        if (userInteracted) {
          audioRef.current.play().catch(e => console.log('Autoplay blocked'));
        }
      }
      isInitial.current = false;
      setNotifs(newNotifs);
      setCount(newCount);
      setLastCount(newCount);
    } catch {}
  };

  useEffect(() => {
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 10000); // Poll every 10s
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifs([]);
      setCount(0);
    } catch {}
  };

  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); fetchNotifs(); } catch {}
  };

  const handleNotifClick = (n) => {
    markRead(n._id);
    setOpen(false);
    if (n.type === 'new_kot') navigate('/admin/kitchen');
    else if (n.type === 'new_order' || n.type === 'new_booking') navigate('/admin/dashboard');
    else if (n.type === 'bill_generated') navigate('/admin/billing');
  };

  const typeIcon = { new_order:'🪑', kot_ready:'🍳', new_booking:'🏨', new_feedback:'⭐', bill_generated:'🧾', new_kot:'🔔' };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-cream-200 transition-colors">
        <svg className="w-5 h-5 text-charcoal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-cream-50 border border-gold-200 rounded-xl shadow-gold-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold-200">
            <p className="font-semibold text-charcoal-900 text-sm">Notifications</p>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-gold-600 hover:underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-center text-charcoal-400 text-sm py-8">No new notifications</p>
            ) : notifs.map((n) => (
              <div key={n._id} onClick={() => handleNotifClick(n)} className="cursor-pointer px-4 py-3 border-b border-cream-200 hover:bg-cream-100 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">{typeIcon[n.type] || '🔔'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-charcoal-900">{n.title}</p>
                    <p className="text-xs text-charcoal-500 truncate">{n.message}</p>
                    <p className="text-[10px] text-charcoal-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;