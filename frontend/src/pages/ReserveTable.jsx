import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import api from '../api/axios';

const BG_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80";
const TIME_SLOTS = ['12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM'];
const OCCASIONS  = ['','Birthday','Anniversary','Business Meeting','Family Gathering','Engagement','Other'];

export default function ReserveTable() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', date: new Date().toISOString().split('T')[0], time:'', guests:'2', occasion:'', specialRequest:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/reservations/table', { ...form, guests: Number(form.guests) });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed. Please call us directly.');
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
            <p className="eyebrow text-gold-400 mb-3">Reservation Confirmed</p>
            <h2 className="font-serif text-4xl text-white font-light mb-3">Thank You, {form.name}</h2>
            <p className="font-sans text-sm text-white/70 font-light leading-relaxed mb-2">
              Your table for <strong>{form.guests} guests</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong> has been received.
            </p>
            <p className="font-sans text-sm text-white/50 mb-8">We will confirm via WhatsApp to <strong>{form.phone}</strong> shortly.</p>
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
        <section className="pt-36 pb-20 relative overflow-hidden">
          <div className="container-lux relative z-10 text-center">
            <p className="eyebrow text-gold-400 mb-4">Dining Experience</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-light text-white mb-4">Reserve a Table</h1>
            <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
            <p className="font-serif text-lg text-cream-100/70 italic">Book your place for an unforgettable dining experience.</p>
          </div>
        </section>

        {/* Form section */}
        <section className="section pb-24 pt-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="glass-luxury border border-white/10 p-7 sm:p-10 shadow-luxury">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid sm:grid-cols-2 gap-7">
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Full Name *</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                        placeholder="Your name" 
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
                  </div>
                  <div className="grid sm:grid-cols-3 gap-7">
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Date *</label>
                      <input 
                        type="date" 
                        min={today} 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                        value={form.date}
                        onChange={e => setForm(p => ({...p, date: e.target.value}))} 
                      />
                      {errors.date && <p className="font-sans text-xs text-red-400 mt-1">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Time *</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                        value={form.time} 
                        onChange={e => setForm(p => ({...p, time: e.target.value}))}
                      >
                        <option value="" className="bg-charcoal-950 text-white">Select time</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-charcoal-950 text-white">{t}</option>)}
                      </select>
                      {errors.time && <p className="font-sans text-xs text-red-400 mt-1">{errors.time}</p>}
                    </div>
                    <div>
                      <label className="label-luxury text-gold-400/90 text-[10px]">Guests</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                        value={form.guests} 
                        onChange={e => setForm(p => ({...p, guests: e.target.value}))}
                      >
                        {[1,2,3,4,5,6,8,10,12,15,20].map(n => <option key={n} value={n} className="bg-charcoal-950 text-white">{n} {n===1?'Guest':'Guests'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label-luxury text-gold-400/90 text-[10px]">Occasion</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium" 
                      value={form.occasion} 
                      onChange={e => setForm(p => ({...p, occasion: e.target.value}))}
                    >
                      {OCCASIONS.map(o => <option key={o} value={o} className="bg-charcoal-950 text-white">{o || 'Select occasion (optional)'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-luxury text-gold-400/90 text-[10px]">Special Requests</label>
                    <textarea 
                      rows={3} 
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-medium resize-none"
                      placeholder="Dietary requirements, seating preferences, special arrangements..."
                      value={form.specialRequest} 
                      onChange={e => setForm(p => ({...p, specialRequest: e.target.value}))} 
                    />
                  </div>
                  {error && <p className="font-sans text-sm text-red-400">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-taj-gold w-full py-4 text-xs font-semibold">
                    {submitting ? 'Confirming...' : 'Reserve Table'}
                  </button>
                  <p className="font-sans text-[10px] text-white/40 text-center tracking-wide mt-3">
                    We will confirm your reservation via WhatsApp within 30 minutes.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
