import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ImageSlider from '../components/ImageSlider';
import api from '../api/axios';

const BG_IMAGE = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1920&q=80";
const STEPS = ['Select Room', 'Personal Details', 'Confirm Booking'];

export default function ReserveRoom() {
  const location = useLocation();
  const state = location.state || {};

  const [step, setStep] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  
  // Initialize with states passed from landing page widget if available
  const [checkIn, setCheckIn] = useState(state.checkIn || new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => {
    if (state.checkOut) return state.checkOut;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(state.guests || 1);
  const [form, setForm] = useState({ name:'', phone:'', email:'', specialRequest:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms/manage/public');
        setRooms(res.data.data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);
  const oneMonthLaterStr = oneMonthLater.toISOString().split('T')[0];

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const minCheckOut = checkInDate ? new Date(checkInDate.getTime() + 86400000).toISOString().split('T')[0] : todayStr;
  const maxCheckOut = checkInDate ? new Date(checkInDate.getTime() + 4 * 86400000).toISOString().split('T')[0] : '';
  
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const subtotal = selected ? selected.price * nights : 0;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst;

  const validateStep1 = () => {
    const e = {};
    if (!selected) e.room = 'Please select a room type';
    if (!checkIn) e.checkIn = 'Required';
    if (!checkOut) e.checkOut = 'Required';
    return e;
  };
  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim() || form.phone.trim().length < 10) e.phone = 'Valid phone required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      await api.post('/reservations/room', { ...form, checkIn, checkOut, roomType: selected.type, guests: Number(guests) });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative text-white"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-12">
          <div className="glass-luxury p-8 md:p-12 text-center max-w-lg border border-white/10 shadow-luxury">
            <div className="w-20 h-20 bg-gold-gradient mx-auto mb-6 flex items-center justify-center">
              <svg className="w-9 h-9 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="eyebrow text-gold-400 mb-3">Booking Confirmed</p>
            <h2 className="font-serif text-4xl text-white font-light mb-3">Thank You, {form.name}</h2>
            <p className="font-sans text-sm text-white/60 font-light leading-relaxed mb-2">
              Your reservation for the <strong>{selected?.name}</strong> has been received.
            </p>
            <p className="font-sans text-sm text-white/60 mb-8">
              We'll confirm via WhatsApp to <strong>{form.phone}</strong> within 2 hours.
            </p>
            <Link to="/" className="btn-taj-gold py-3.5 px-8 inline-flex">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative text-white"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/82 z-0 pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <div className="relative h-[300px] flex items-center justify-center text-center overflow-hidden">
          <div className="relative z-10 pt-16">
            <p className="eyebrow text-gold-400 mb-2">Accommodations</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">Plan Your Stay</h1>
            <div className="w-12 h-px bg-gold-400/40 mx-auto mt-4" />
          </div>
        </div>

        {/* Step indicator — Taj-style */}
        <div className=" py-5 sticky top-16 md:top-20 z-30 ">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
                      i < step ? 'bg-gold-gradient border-transparent' :
                      i === step ? 'border-gold-400 bg-gold-400/10' : 'border-white/20 bg-white/5'
                    }`}>
                      {i < step ? (
                        <svg className="w-3.5 h-3.5 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`font-sans text-xs font-semibold ${i === step ? 'text-gold-400' : 'text-white/40'}`}>{i+1}</span>
                      )}
                    </div>
                    <p className={`font-sans text-[9px] tracking-[0.12em] uppercase mt-2 whitespace-nowrap ${
                      i === step ? 'text-gold-400' : i < step ? 'text-white/80' : 'text-white/40'
                    }`}>{s}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-[1.5px] mx-3 transition-all duration-500 ${i < step ? 'bg-gold-400' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8 relative">
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 0: Dates and Rooms */}
            {step === 0 && (
              <Reveal>
                {/* Date range picker panel */}
                <div className="glass-luxury border border-white/10 p-6 mb-5">
                  <h3 className="font-serif text-lg text-white mb-5 font-light tracking-wide">When are you visiting?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <label className="label-luxury text-gold-400/90 text-[10px]">Check In</label>
                      <input 
                        type="date" 
                        min={todayStr} 
                        max={oneMonthLaterStr} 
                        value={checkIn} 
                        onChange={e => setCheckIn(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                      />
                      {errors.checkIn && <p className="font-sans text-xs text-red-400 mt-1">{errors.checkIn}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="label-luxury text-gold-400/90 text-[10px]">Check Out</label>
                      <input 
                        type="date" 
                        min={minCheckOut} 
                        max={maxCheckOut} 
                        value={checkOut} 
                        onChange={e => setCheckOut(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                      />
                      {errors.checkOut && <p className="font-sans text-xs text-red-400 mt-1">{errors.checkOut}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="label-luxury text-gold-400/90 text-[10px]">Guests</label>
                      <select 
                        value={guests} 
                        onChange={e => setGuests(Number(e.target.value))} 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium"
                      >
                        {[1,2,3,4,5,6,8,10,15,20].map(n => <option key={n} value={n} className="bg-charcoal-900 text-white">{n} {n===1?'Guest':'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rooms selection list panel */}
                <div className="glass-luxury border border-white/10 p-6">
                  <h3 className="font-serif text-lg text-white mb-4 font-light tracking-wide">Explore Our Rooms</h3>
                  {loading ? (
                    <div className="text-center py-4 text-white/50">Loading rooms...</div>
                  ) : (
                    <div className="space-y-3">
                      {errors.room && <p className="font-sans text-xs text-red-400 mb-3">{errors.room}</p>}
                      {rooms.map(room => (
                        <div 
                          key={room._id} 
                          onClick={() => setSelected(room)}
                          className={`border-2 p-5 cursor-pointer transition-all duration-300 hover:border-gold-400/40 bg-charcoal-950/40 ${
                            selected?._id === room._id ? 'border-gold-400 shadow-gold bg-gold-400/5' : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                selected?._id === room._id ? 'bg-gold-gradient border-transparent' : 'border-white/30'
                              }`}>
                                {selected?._id === room._id && (
                                  <svg className="w-3.5 h-3.5 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-serif text-lg text-white">{room.name}</p>
                                <p className="font-sans text-xs text-white/50 mt-0.5">{room.size} · Up to {room.capacity} guests</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {room.amenities.map(h => (
                                    <span key={h} className="font-sans text-[9px] text-gold-300 border border-gold-400/35 px-2 py-0.5 bg-gold-400/5">{h}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-serif text-2xl text-gold-400">₹{room.price.toLocaleString('en-IN')}</p>
                              <p className="font-sans text-[9px] text-white/40">/ night</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => { const e = validateStep1(); if (Object.keys(e).length) { setErrors(e); return; } setStep(1); setErrors({}); }}
                  className="btn-taj-gold mt-5"
                >
                  Continue to Personal Details →
                </button>
              </Reveal>
            )}

            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <Reveal>
                <div className="glass-luxury border border-white/10 p-6 sm:p-8">
                  <h3 className="font-serif text-xl text-white mb-7 font-light tracking-wide">Your Details</h3>
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label-luxury text-gold-400/90 text-[10px]">Full Name *</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                          placeholder="Your full name" 
                          value={form.name}
                          onChange={e => setForm(p => ({...p, name: e.target.value}))} 
                        />
                        {errors.name && <p className="font-sans text-xs text-red-400 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="label-luxury text-gold-400/90 text-[10px]">Phone Number *</label>
                        <input 
                          type="tel" 
                          className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                          placeholder="+91 XXXXX XXXXX" 
                          value={form.phone}
                          onChange={e => setForm(p => ({...p, phone: e.target.value}))} 
                        />
                        {errors.phone && <p className="font-sans text-xs text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                        placeholder="you@example.com" 
                        value={form.email}
                        onChange={e => setForm(p => ({...p, email: e.target.value}))} 
                      />
                      {errors.email && <p className="font-sans text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Special Requests</label>
                      <textarea 
                        rows={3} 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium resize-none"
                        placeholder="Dietary requirements, accessibility needs, special arrangements..."
                        value={form.specialRequest} 
                        onChange={e => setForm(p => ({...p, specialRequest: e.target.value}))} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-7">
                    <button onClick={() => setStep(0)} className="inline-flex items-center justify-center border border-white/20 text-white font-sans font-medium text-[10px] tracking-[0.2em] uppercase px-6 py-3 hover:border-white transition-all">← Back</button>
                    <button onClick={() => { const e = validateStep2(); if (Object.keys(e).length) { setErrors(e); return; } setStep(2); setErrors({}); }}
                      className="btn-taj-gold">Review Booking →</button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* STEP 2: Confirm */}
            {step === 2 && (
              <Reveal>
                <div className="glass-luxury border border-white/10 p-6 sm:p-8">
                  <h3 className="font-serif text-xl text-white mb-7 font-light tracking-wide">Confirm Your Booking</h3>
                  <div className="space-y-1 mb-7">
                    {[
                      ['Room Type', selected?.name],
                      ['Check In', checkIn],
                      ['Check Out', checkOut],
                      ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                      ['Guests', guests],
                      ['Guest Name', form.name],
                      ['Phone', form.phone],
                      ['Email', form.email || '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-white/50">{k}</p>
                        <p className="font-sans text-sm text-white font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                  {error && <p className="font-sans text-sm text-red-400 mb-4">{error}</p>}
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="inline-flex items-center justify-center border border-white/20 text-white font-sans font-medium text-[10px] tracking-[0.2em] uppercase px-6 py-3 hover:border-white transition-all">← Back</button>
                    <button onClick={handleSubmit} disabled={submitting} className="btn-taj-gold disabled:opacity-60">
                      {submitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar — Your Stay */}
          <div className="lg:col-span-1">
            <div className="glass-luxury border border-white/10 p-6 sticky top-40">
              <h3 className="font-serif text-lg text-white mb-5 pb-4 border-b border-white/5 font-light tracking-wide">Your Stay</h3>
              {!selected ? (
                <p className="font-sans text-sm text-white/40 font-light leading-relaxed">Select a room to see your booking summary.</p>
              ) : (
                <div className="space-y-3">
                  <div className="bg-charcoal-950 -mx-6 -mt-5 mb-5 overflow-hidden">
                    <img 
                      src={selected.images[0] || '/placeholder-room.jpg'} 
                      alt={selected.name} 
                      className="w-full h-40 object-cover"
                      onError={(e) => e.target.src = '/placeholder-room.jpg'}
                    />
                    <div className="px-6 py-4 bg-charcoal-900/90 border-b border-white/5">
                      <p className="font-serif text-xl text-white font-light">{selected.name}</p>
                      <p className="font-sans text-xs text-white/50 mt-0.5">{selected.size} · {selected.capacity} guests</p>
                    </div>
                  </div>
                  {[
                    ['Check In', checkIn || '—'],
                    ['Check Out', checkOut || '—'],
                    ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                    ['Guests', guests],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-b-0">
                      <span className="font-sans text-white/50">{k}</span>
                      <span className="font-sans text-white font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans text-white/50">Room Rate ({nights}n)</span>
                      <span className="font-sans text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-sans text-white/50">GST (12%)</span>
                      <span className="font-sans text-white">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-3 mt-2 border-t border-white/10">
                      <span className="font-serif text-base text-white">Total</span>
                      <span className="font-serif text-xl text-gold-400">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="font-sans text-[10px] text-white/30 text-center pt-4">
                    Payment at property · Free cancellation 24h prior
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
