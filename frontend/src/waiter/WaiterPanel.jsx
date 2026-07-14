import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Alert } from '../components/Common';
import NotificationBell from '../components/NotificationBell';

const MOCK_TABLES = Array.from({ length: 10 }, (_, i) => ({
  _id: `t${i + 1}`,
  number: i + 1,
  status: i === 1 ? 'occupied' : i === 3 ? 'reserved' : 'available',
  capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
  section: i < 5 ? 'Main Hall' : 'Garden',
  session: i === 1 ? { customerName: 'Rahul', guestCount: 2, total: 850, status: 'active' } : null,
}));

const MOCK_MENU = [
  { _id: 'm1', name: 'Paneer Tikka', price: 280, category: 'Starters', type: 'Veg' },
  { _id: 'm2', name: 'Dal Makhani', price: 280, category: 'Main Course', type: 'Veg' },
  { _id: 'm3', name: 'Paneer Butter Masala', price: 320, category: 'Main Course', type: 'Veg' },
  { _id: 'm4', name: 'Jain Thali', price: 390, category: 'Specials', type: 'Vegan' },
  { _id: 'm5', name: 'Butter Naan', price: 50, category: 'Breads', type: 'Veg' },
  { _id: 'm6', name: 'Garlic Naan', price: 65, category: 'Breads', type: 'Veg' },
  { _id: 'm7', name: 'Veg Dum Biryani', price: 280, category: 'Rice & Biryani', type: 'Veg' },
  { _id: 'm8', name: 'Mango Lassi', price: 120, category: 'Beverages', type: 'Veg' },
  { _id: 'm9', name: 'Gulab Jamun', price: 120, category: 'Desserts', type: 'Veg' },
];

const statusStyles = {
  available: 'border-green-300 bg-green-50 text-green-800',
  occupied: 'border-red-300 bg-red-50 text-red-800',
  reserved: 'border-amber-300 bg-amber-50 text-amber-800',
  cleaning: 'border-blue-300 bg-blue-50 text-blue-800',
};

const orderStatus = {
  pending: 'text-amber-700 bg-amber-50 border-amber-200',
  preparing: 'text-blue-700 bg-blue-50 border-blue-200',
  ready: 'text-green-700 bg-green-50 border-green-200',
  served: 'text-charcoal-600 bg-cream-100 border-cream-200',
};

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

export default function WaiterPanel() {
  const navigate = useNavigate();
  const audioRef = useRef(new Audio('/bell.wav'));
  const [step, setStep] = useState('tables');
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [session, setSession] = useState(null);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regForm, setRegForm] = useState({ customerName: '', customerPhone: '', customerDOB: '', guestCount: 1 });
  const [regErrors, setRegErrors] = useState({});
  const [registering, setRegistering] = useState(false);
  const [cart, setCart] = useState([]);
  const [menuCat, setMenuCat] = useState('All');
  const [search, setSearch] = useState('');
  const [addingOrder, setAddingOrder] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, mRes] = await Promise.all([api.get('/tables'), api.get('/menu')]);
      setTables(tRes.data.data || []);
      setMenuItems((mRes.data.data || []).filter((m) => m.type !== 'Non-Veg'));
      setOffline(false);
    } catch {
      setTables(MOCK_TABLES);
      setMenuItems(MOCK_MENU);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Poll for ready KOTs
  useEffect(() => {
    const checkKOTs = async () => {
        try {
            const res = await api.get('/kot?status=ready');
            const readyKOTs = res.data.data;
            if (readyKOTs.length > 0 && userInteracted) {
                audioRef.current.play().catch(e => console.log('Autoplay blocked'));
            }
        } catch (err) {}
    };
    const iv = setInterval(checkKOTs, 10000);
    return () => clearInterval(iv);
  }, []);

  const resetToTables = () => {
    setStep('tables');
    setSelectedTable(null);
    setSession(null);
    setCart([]);
    setSearch('');
    setAlert({ type: '', msg: '' });
    fetchAll();
  };

  const selectTable = async (table) => {
    setSelectedTable(table);
    setCart([]);
    setSearch('');
    if (table.status === 'occupied') {
      try {
        const res = await api.get(`/tables/${table._id}/session`);
        setSession(res.data.data);
      } catch {
        setSession(table.session || null);
      }
      setStep('order');
    } else {
      setRegForm({ customerName: '', customerPhone: '', customerDOB: '', guestCount: 1 });
      setStep('register');
    }
  };

  const validateReg = () => {
    const e = {};
    if (!regForm.customerName.trim()) e.customerName = 'Name is required';
    if (!regForm.customerPhone.trim() || regForm.customerPhone.replace(/\D/g, '').length < 10) e.customerPhone = 'Valid phone required';
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateReg();
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegistering(true);
    try {
      if (offline) {
        setSession({ _id: 's1', ...regForm, tableNumber: selectedTable.number, orders: [], subtotal: 0, gstAmount: 0, total: 0, status: 'active', waiterName: 'Demo Waiter' });
        setAlert({ type: 'success', msg: 'Customer registered in demo mode.' });
      } else {
        const res = await api.post(`/tables/${selectedTable._id}/session/start`, regForm);
        setSession(res.data.data);
        setAlert({ type: 'success', msg: 'Customer registered. You can start ordering.' });
      }
      setSelectedTable((p) => ({ ...p, status: 'occupied' }));
      setStep('order');
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Registration failed.' });
    } finally {
      setRegistering(false);
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.menuItemId === item._id);
      if (exists) return prev.map((c) => c.menuItemId === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity: 1, notes: '' }];
    });
  };

  const updateCart = (id, qty) => {
    if (qty < 1) return setCart((p) => p.filter((c) => c.menuItemId !== id));
    setCart((p) => p.map((c) => c.menuItemId === id ? { ...c, quantity: qty } : c));
  };

  const updateNotes = (id, notes) => {
    setCart((p) => p.map((c) => c.menuItemId === id ? { ...c, notes } : c));
  };

  const sendOrder = async () => {
    if (!cart.length) return;
    setAddingOrder(true);
    try {
      if (offline) {
        const newOrders = cart.map((c) => ({ ...c, status: 'pending', kotSent: true }));
        setSession((p) => ({ ...p, orders: [...(p?.orders || []), ...newOrders], total: (p?.total || 0) + cartTotal * 1.05 }));
        setAlert({ type: 'success', msg: 'KOT sent to kitchen in demo mode.' });
      } else {
        const res = await api.post(`/tables/${selectedTable._id}/session/order`, { items: cart });
        setSession(res.data.data);
        setAlert({ type: 'success', msg: `KOT ${res.data.kot?.kotNumber || ''} sent to kitchen.` });
      }
      setCart([]);
      setSearch('');
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Order failed.' });
    } finally {
      setAddingOrder(false);
    }
  };

  const vegMenu = menuItems.filter((m) => m.type !== 'Non-Veg' && m.isAvailable !== false);
  const categories = ['All', ...new Set(vegMenu.map((m) => m.category))];
  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vegMenu.filter((m) => {
      const catMatch = menuCat === 'All' || m.category === menuCat;
      const searchMatch = !q || `${m.name} ${m.category} ${m.price}`.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [vegMenu, menuCat, search]);

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartGst = Number((cartTotal * 0.05).toFixed(2));
  const cartGrand = cartTotal + cartGst;
  const existingTotal = Number(session?.total || 0);

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-900">
      <header className="sticky top-0 z-30 bg-charcoal-950/96 backdrop-blur-xl  text-charcoal-900 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {step !== 'tables' && (
              <button onClick={resetToTables} className="w-10 h-10 rounded-lg border border-gold-400/35 text-gold-300 hover:bg-gold-400 hover:text-charcoal-950 transition-all" aria-label="Back">
                &larr;
              </button>
            )}
            <div>
              <p className="font-display text-2xl font-bold leading-none">Waiter Dashboard</p>
              <p className="text-sm font-semibold text-gold-300 mt-1">
                {selectedTable ? `Table ${selectedTable.number} - ${selectedTable.section}` : 'Live table service'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button onClick={() => navigate('/admin/dashboard')} className="btn-outline-dark px-4 py-2 text-[11px]">Admin</button>
            <button onClick={fetchAll} className="btn-outline-dark px-4 py-2 text-[12px]">Refresh</button>
            <a href="/admin/kitchen" target="_blank" rel="noopener noreferrer" className="btn-gold px-4 py-2 text-[11px]">Kitchen</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {offline && <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm font-semibold text-amber-800">Demo Mode - backend is offline.</div>}
        {alert.msg && <div className="mb-4"><Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} /></div>}

        {step === 'tables' && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="eyebrow text-gold-600 mb-2">Floor Plan</p>
                <h1 className="font-display text-4xl font-bold text-charcoal-950">Select Table</h1>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {['available', 'occupied', 'reserved'].map((s) => (
                  <div key={s} className="bg-white border border-cream-200 rounded-lg px-4 py-2">
                    <p className="text-xl font-bold">{tables.filter((t) => t.status === s).length}</p>
                    <p className="text-[11px] font-bold uppercase text-charcoal-500">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            {loading ? (
            <div className="flex justify-center py-14"><div className="spinner" /></div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tables.map((t) => (
                <button key={t._id} onClick={() => selectTable(t)}
                    className={`text-left rounded-lg border-2 p-4 min-h-[150px] transition-all hover:-translate-y-1 hover:shadow-luxury ${statusStyles[t.status] || statusStyles.available}`}>
                    <div className="flex items-start justify-between">
                      <p className="font-display text-4xl font-bold">T{t.number}</p>
                      <span className="text-[11px] font-extrabold uppercase tracking-wide">{t.status}</span>
                    </div>
                    <p className="text-sm font-bold mt-2">{t.section}</p>
                    <p className="text-sm">Capacity {t.capacity}</p>
                    {t.session && (
                      <div className="mt-3 border-t border-current/15 pt-2">
                        <p className="font-bold truncate">{t.session.customerName}</p>
                        <p className="text-sm">Rs.{Number(t.session.total || 0).toFixed(0)} running</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {step === 'register' && (
          <section className="max-w-2xl mx-auto">
            <div className="bg-white border border-gold-200 rounded-lg p-5 sm:p-7 shadow-luxury">
              <p className="eyebrow text-gold-600 mb-2">New Guest</p>
              <h1 className="font-display text-3xl font-bold mb-6">Register Table {selectedTable?.number}</h1>
              <form onSubmit={handleRegister} className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">Customer Name *</label>
                  <input className="input-field" value={regForm.customerName} onChange={(e) => setRegForm((p) => ({ ...p, customerName: e.target.value }))} placeholder="Full name" />
                  {regErrors.customerName && <p className="text-red-600 text-sm font-semibold mt-1">{regErrors.customerName}</p>}
                </div>
                <div>
                  <label className="label-field">Mobile Number *</label>
                  <input className="input-field" type="tel" value={regForm.customerPhone} onChange={(e) => setRegForm((p) => ({ ...p, customerPhone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  {regErrors.customerPhone && <p className="text-red-600 text-sm font-semibold mt-1">{regErrors.customerPhone}</p>}
                </div>
                <div>
                  <label className="label-field">Date of Birth</label>
                  <input className="input-field" type="date" value={regForm.customerDOB} onChange={(e) => setRegForm((p) => ({ ...p, customerDOB: e.target.value }))} />
                </div>
                <div>
                  <label className="label-field">Guests</label>
                  <input className="input-field" type="number" min="1" max="20" value={regForm.guestCount} onChange={(e) => setRegForm((p) => ({ ...p, guestCount: Number(e.target.value) }))} />
                </div>
                <button type="submit" disabled={registering} className="btn-gold sm:col-span-2 disabled:opacity-60">
                  {registering ? 'Registering...' : 'Register & Start Order'}
                </button>
              </form>
            </div>
          </section>
        )}

        {step === 'order' && (
          <section className="grid lg:grid-cols-[1fr_350px] gap-5">
            <div className="space-y-5">
              <div className="bg-white border border-gold-200 rounded-lg p-4 sm:p-5 shadow-sm">
                <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                  <div>
                    <label className="label-field">Live Search</label>
                    <input className="input-field text-lg" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." autoFocus />
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map((c) => (
                      <button key={c} onClick={() => setMenuCat(c)}
                        className={`shrink-0 rounded-lg px-4 py-3 text-sm font-extrabold transition-all ${menuCat === c ? 'bg-charcoal-950 text-gold-300 shadow-gold' : 'bg-cream-100 text-charcoal-700 hover:bg-gold-50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredMenu.map((item) => {
                  const inCart = cart.find((c) => c.menuItemId === item._id);
                  return (
                    <div key={item._id} className={`bg-white rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-luxury ${inCart ? 'border-gold-400 ring-2 ring-gold-100' : 'border-cream-200'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-lg leading-tight">{item.name}</p>
                          <p className="text-sm font-semibold text-charcoal-500 mt-1">{item.category}</p>
                        </div>
                        <span className="text-[11px] font-extrabold text-green-700 border border-green-300 bg-green-50 rounded px-2 py-1">
                          {item.type === 'Vegan' ? 'Jain' : 'Veg'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <p className="font-display text-2xl font-bold text-gold-600">Rs.{item.price}</p>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCart(item._id, inCart.quantity - 1)} className="w-10 h-10 rounded-lg bg-cream-100 font-bold hover:bg-cream-200">-</button>
                            <span className="w-8 text-center font-bold">{inCart.quantity}</span>
                            <button onClick={() => updateCart(item._id, inCart.quantity + 1)} className="w-10 h-10 rounded-lg bg-gold-400 text-charcoal-950 font-bold hover:bg-gold-300">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)} className="btn-gold px-4 py-2 text-[12px]">Add</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredMenu.length === 0 && (
                <div className="bg-white border border-cream-200 rounded-lg p-10 text-center">
                  <p className="font-display text-2xl font-bold text-charcoal-700">No matching items</p>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 h-max bg-charcoal-950 text-cream-50 rounded-lg shadow-luxury overflow-hidden">

              <div className="p-5 border-b border-gold-400/20">
                <p className="eyebrow text-gold-400 mb-2">Cart</p>
                <h2 className="font-display text-3xl font-bold">Table {selectedTable?.number}</h2>
                {session && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-cream-100/55">Guest</span><br /><strong>{session.customerName}</strong></p>
                    <p><span className="text-cream-100/55">Guests</span><br /><strong>{session.guestCount}</strong></p>
                    <p className="col-span-2"><span className="text-cream-100/55">Phone</span><br /><strong>{session.customerPhone}</strong></p>
                  </div>
                )}
              </div>

              <div className="p-5">
                {cart.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gold-400/25 rounded-lg">
                    <p className="font-display text-xl font-bold text-gold-300">Cart is empty</p>
                    <p className="text-sm text-cream-100/55 mt-1">Search and add items instantly.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((c) => (
                      <div key={c.menuItemId} className="bg-white/6 border border-white/10 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-sm text-cream-100/55">Rs.{c.price} each</p>
                          </div>
                          <p className="font-bold text-gold-300">Rs.{(c.price * c.quantity).toFixed(0)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 gap-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCart(c.menuItemId, c.quantity - 1)} className="w-9 h-9 rounded-lg bg-white/10 font-bold hover:bg-white/15">-</button>
                            <span className="w-8 text-center font-bold">{c.quantity}</span>
                            <button onClick={() => updateCart(c.menuItemId, c.quantity + 1)} className="w-9 h-9 rounded-lg bg-gold-400 text-charcoal-950 font-bold hover:bg-gold-300">+</button>
                          </div>
                          <button onClick={() => updateCart(c.menuItemId, 0)} className="text-sm font-bold text-red-300 hover:text-red-200">Remove</button>
                        </div>
                        <input className="mt-3 w-full rounded-lg bg-charcoal-900 border border-white/10 px-3 py-2 text-sm text-white placeholder-cream-100/30 focus:outline-none focus:border-gold-400" value={c.notes} onChange={(e) => updateNotes(c.menuItemId, e.target.value)} placeholder="Notes: less spicy, no chilli..." />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 space-y-2 border-t border-gold-400/20 pt-4">
                  <div className="flex justify-between text-sm"><span className="text-cream-100/65">Subtotal</span><strong>Rs.{cartTotal.toFixed(2)}</strong></div>
                  <div className="flex justify-between text-sm"><span className="text-cream-100/65">GST 5%</span><strong>Rs.{cartGst.toFixed(2)}</strong></div>
                  <div className="flex justify-between text-xl font-bold text-gold-300 pt-2"><span>New Total</span><span>Rs.{cartGrand.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-cream-100/55"><span>Existing Bill</span><span>Rs.{existingTotal.toFixed(2)}</span></div>
                </div>

                <button onClick={sendOrder} disabled={!cart.length || addingOrder || session?.status === 'billed'} className="btn-gold w-full mt-5 disabled:opacity-45">
                  {addingOrder ? 'Sending KOT...' : `Send KOT (${cart.length})`}
                </button>
                {session?.status === 'billed' ? (
                  <p className="mt-3 rounded-lg bg-amber-50 text-amber-800 p-3 text-sm font-bold">Bill is generated. Await admin payment verification before closing the table.</p>
                ) : session?.orders?.length > 0 ? (
                  <a href="/admin/tables" className="block text-center mt-3 text-sm font-bold text-gold-300 hover:text-gold-200">Generate bill in Admin Tables</a>
                ) : null}
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
