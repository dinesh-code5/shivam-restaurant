import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ImageSlider from '../components/ImageSlider';
import api from '../api/axios';

const ROOM_TYPES = [
  { value:'Deluxe Room',    label:'Deluxe Room',    price:2500,  size:'320 sq ft',  cap:2,   highlights:['Garden View','King Bed','AC','WiFi'] },
  { value:'Premium Suite',  label:'Premium Suite',  price:5500,  size:'650 sq ft',  cap:4,   highlights:['Balcony','Jacuzzi','Mini Bar','Butler'] },
  { value:'Family Room',    label:'Family Room',    price:3800,  size:'480 sq ft',  cap:6,   highlights:['Sleeps 6','Extra Beds','Lounge','Resort View'] },
  { value:'Banquet Hall',   label:'Banquet Hall',   price:25000, size:'3500 sq ft', cap:200, highlights:['200+ Capacity','AV System','Catering','Decor'] },
];

const STEPS = ['Select Room', 'Personal Details', 'Confirm Booking'];

export default function ReserveRoom() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [form, setForm] = useState({ name:'', phone:'', email:'', specialRequest:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

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
      await api.post('/reservations/room', { ...form, checkIn, checkOut, roomType: selected.value, guests: Number(guests) });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4 pt-24 pb-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gold-gradient mx-auto mb-6 flex items-center justify-center">
            <svg className="w-9 h-9 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="eyebrow text-gold-500 mb-3">Booking Confirmed</p>
          <h2 className="font-serif text-4xl text-charcoal-900 font-light mb-3">Thank You, {form.name}</h2>
          <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed mb-2">
            Your reservation for the <strong>{selected?.label}</strong> has been received.
          </p>
          <p className="font-sans text-sm text-charcoal-400 mb-8">
            We'll confirm via WhatsApp to <strong>{form.phone}</strong> within 2 hours.
          </p>
          <Link to="/" className="btn-primary inline-flex">Back to Home</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-100">

        {/* Header */}
        <div className="relative h-[400px] flex items-center justify-center text-center overflow-hidden">
          <img src="/bg-rooms.jpg" alt="Rooms Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)]" />
          <div className="relative z-10">
            <p className="eyebrow text-gold-400 mb-2">Accommodations</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">Plan Your Stay</h1>
          </div>
        </div>

        {/* Step indicator — Taj-style */}
        <div className="bg-white border-b border-cream-200 py-5 sticky top-16 md:top-20 z-30">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center border-2 transition-all duration-300 ${
                      i < step ? 'bg-gold-gradient border-transparent' :
                      i === step ? 'border-gold-400 bg-white' : 'border-cream-300 bg-white'
                    }`}>
                      {i < step ? (
                        <svg className="w-3.5 h-3.5 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`font-sans text-xs font-medium ${i === step ? 'text-gold-500' : 'text-charcoal-300'}`}>{i+1}</span>
                      )}
                    </div>
                    <p className={`font-sans text-[9px] tracking-[0.12em] uppercase mt-1.5 whitespace-nowrap ${
                      i === step ? 'text-gold-500' : i < step ? 'text-charcoal-500' : 'text-charcoal-300'
                    }`}>{s}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-all duration-500 ${i < step ? 'bg-gold-400' : 'bg-cream-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 0: Select Room + Dates */}
            {step === 0 && (
              <Reveal>
                {/* Dates */}
                <div className="bg-white border border-cream-200 p-6 mb-5">
                  <h3 className="font-serif text-lg text-charcoal-900 mb-5">When are you visiting?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <label className="label-luxury">Check In</label>
                      <input type="date" min={todayStr} max={oneMonthLaterStr} value={checkIn} onChange={e => setCheckIn(e.target.value)} className="input-luxury" />
                      {errors.checkIn && <p className="font-sans text-xs text-red-500 mt-1">{errors.checkIn}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="label-luxury">Check Out</label>
                      <input type="date" min={minCheckOut} max={maxCheckOut} value={checkOut} onChange={e => setCheckOut(e.target.value)} className="input-luxury" />
                      {errors.checkOut && <p className="font-sans text-xs text-red-500 mt-1">{errors.checkOut}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="label-luxury">Guests</label>
                      <select value={guests} onChange={e => setGuests(e.target.value)} className="input-luxury">
                        {[1,2,3,4,5,6,8,10,15,20].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Room options */}
                <div className="bg-white p-6 border border-cream-200">
                  <h3 className="font-serif text-lg text-charcoal-900 mb-4">Explore Our Rooms</h3>
                  <ImageSlider images={['/rooms/deluxe-room.jpg', '/rooms/premium-suite.jpg', '/rooms/family-room.jpg']} />
                  <div className="mt-6 space-y-3">
                    {errors.room && <p className="font-sans text-xs text-red-500 mb-3">{errors.room}</p>}
                    {ROOM_TYPES.map(room => (
                      <div key={room.value} onClick={() => setSelected(room)}
                        className={`bg-white border-2 p-5 cursor-pointer transition-all duration-300 hover:border-gold-300 ${
                          selected?.value === room.value ? 'border-gold-400 shadow-gold' : 'border-cream-200'
                        }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-5 h-5 border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              selected?.value === room.value ? 'bg-gold-gradient border-transparent' : 'border-cream-300'
                            }`}>
                              {selected?.value === room.value && (
                                <svg className="w-3 h-3 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-serif text-lg text-charcoal-900">{room.label}</p>
                              <p className="font-sans text-xs text-charcoal-400 mt-0.5">{room.size} · Up to {room.cap} guests</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {room.highlights.map(h => (
                                  <span key={h} className="font-sans text-[9px] text-gold-600 border border-gold-300/50 px-2 py-0.5">{h}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-serif text-2xl text-charcoal-900">₹{room.price.toLocaleString('en-IN')}</p>
                            <p className="font-sans text-[10px] text-charcoal-400">/ night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { const e = validateStep1(); if (Object.keys(e).length) { setErrors(e); return; } setStep(1); setErrors({}); }}
                  className="btn-primary mt-5">
                  Continue to Personal Details →
                </button>
              </Reveal>
            )}

            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <Reveal>
                <div className="bg-white border border-cream-200 p-6 sm:p-8">
                  <h3 className="font-serif text-xl text-charcoal-900 mb-7">Your Details</h3>
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="label-luxury">Full Name *</label>
                        <input className="input-luxury" placeholder="Your full name" value={form.name}
                          onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                        {errors.name && <p className="font-sans text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="label-luxury">Phone Number *</label>
                        <input type="tel" className="input-luxury" placeholder="+91 XXXXX XXXXX" value={form.phone}
                          onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
                        {errors.phone && <p className="font-sans text-xs text-red-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label-luxury">Email Address</label>
                      <input type="email" className="input-luxury" placeholder="you@example.com" value={form.email}
                        onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                      {errors.email && <p className="font-sans text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="label-luxury">Special Requests</label>
                      <textarea rows={3} className="input-luxury resize-none"
                        placeholder="Dietary requirements, accessibility needs, special arrangements..."
                        value={form.specialRequest} onChange={e => setForm(p => ({...p, specialRequest: e.target.value}))} />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-7">
                    <button onClick={() => setStep(0)} className="btn-outline dark">← Back</button>
                    <button onClick={() => { const e = validateStep2(); if (Object.keys(e).length) { setErrors(e); return; } setStep(2); setErrors({}); }}
                      className="btn-primary">Review Booking →</button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* STEP 2: Confirm */}
            {step === 2 && (
              <Reveal>
                <div className="bg-white border border-cream-200 p-6 sm:p-8">
                  <h3 className="font-serif text-xl text-charcoal-900 mb-7">Confirm Your Booking</h3>
                  <div className="space-y-3 mb-7">
                    {[
                      ['Room Type', selected?.label],
                      ['Check In', checkIn],
                      ['Check Out', checkOut],
                      ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                      ['Guests', guests],
                      ['Guest Name', form.name],
                      ['Phone', form.phone],
                      ['Email', form.email || '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-3 border-b border-cream-100 last:border-0">
                        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-400">{k}</p>
                        <p className="font-sans text-sm text-charcoal-800 font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                  {error && <p className="font-sans text-sm text-red-500 mb-4">{error}</p>}
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-outline dark">← Back</button>
                    <button onClick={handleSubmit} disabled={submitting} className="btn-primary disabled:opacity-60">
                      {submitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar — Your Stay */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-cream-200 p-6 sticky top-40">
              <h3 className="font-serif text-lg text-charcoal-900 mb-5 pb-4 border-b border-cream-100">Your Stay</h3>
              {!selected ? (
                <p className="font-sans text-sm text-charcoal-400 font-light">Select a room to see your booking summary.</p>
              ) : (
                <div className="space-y-2.5">
                  <div className="bg-gold-gradient -mx-6 -mt-5 mb-5 overflow-hidden">
                    <img 
                        src={`/rooms/${selected.label.toLowerCase().replace(' ', '-')}.jpg`} 
                        alt={selected.label} 
                        className="w-full h-40 object-cover"
                        onError={(e) => e.target.src = '/placeholder-room.jpg'}
                    />
                    <div className="px-6 py-4">
                        <p className="font-serif text-xl text-charcoal-900">{selected.label}</p>
                        <p className="font-sans text-xs text-charcoal-700 mt-0.5">{selected.size} · {selected.cap} guests</p>
                    </div>
                  </div>
                  {[
                    ['Check In', checkIn || '—'],
                    ['Check Out', checkOut || '—'],
                    ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                    ['Guests', guests],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="font-sans text-charcoal-400">{k}</span>
                      <span className="font-sans text-charcoal-700 font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-cream-100 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans text-charcoal-400">Room Rate ({nights}n)</span>
                      <span className="font-sans text-charcoal-700">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-sans text-charcoal-400">GST (12%)</span>
                      <span className="font-sans text-charcoal-700">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-cream-100">
                      <span className="font-serif text-base text-charcoal-900">Total</span>
                      <span className="font-serif text-xl text-gold-500">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="font-sans text-[10px] text-charcoal-300 text-center pt-2">
                    Payment at property · Free cancellation 24h prior
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
