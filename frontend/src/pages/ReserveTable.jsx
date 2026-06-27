import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import api from '../api/axios';

const TIME_SLOTS = ['12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM'];
const OCCASIONS  = ['','Birthday','Anniversary','Business Meeting','Family Gathering','Engagement','Other'];

export default function ReserveTable() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', date:'', time:'', guests:'2', occasion:'', specialRequest:'' });
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
    <>
      <Navbar />
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4 pt-24 pb-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gold-gradient mx-auto mb-6 flex items-center justify-center">
            <svg className="w-9 h-9 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="eyebrow text-gold-500 mb-3">Reservation Confirmed</p>
          <h2 className="font-serif text-4xl text-charcoal-900 font-light mb-3">Thank You, {form.name}</h2>
          <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed mb-2">
            Your table for <strong>{form.guests} guests</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong> has been received.
          </p>
          <p className="font-sans text-sm text-charcoal-400 mb-8">We will confirm via WhatsApp to <strong>{form.phone}</strong> shortly.</p>
          <Link to="/" className="btn-primary inline-flex">Back to Home</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      <section className="bg-charcoal-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="container-lux relative z-10 text-center">
          <p className="eyebrow text-gold-400 mb-4">Dining Experience</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white mb-4">Reserve a Table</h1>
          <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
          <p className="font-serif text-lg text-cream-100/55 italic">Book your place for an unforgettable dining experience.</p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="bg-white border border-cream-200 p-7 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-7">
                  <div>
                    <label className="label-luxury">Full Name *</label>
                    <input className="input-luxury" placeholder="Your name" value={form.name}
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
                </div>
                <div className="grid sm:grid-cols-3 gap-7">
                  <div>
                    <label className="label-luxury">Date *</label>
                    <input type="date" min={today} className="input-luxury" value={form.date}
                      onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                    {errors.date && <p className="font-sans text-xs text-red-500 mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Time *</label>
                    <select className="input-luxury" value={form.time} onChange={e => setForm(p => ({...p, time: e.target.value}))}>
                      <option value="">Select time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.time && <p className="font-sans text-xs text-red-500 mt-1">{errors.time}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Guests</label>
                    <select className="input-luxury" value={form.guests} onChange={e => setForm(p => ({...p, guests: e.target.value}))}>
                      {[1,2,3,4,5,6,8,10,12,15,20].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-luxury">Occasion</label>
                  <select className="input-luxury" value={form.occasion} onChange={e => setForm(p => ({...p, occasion: e.target.value}))}>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o || 'Select occasion (optional)'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Special Requests</label>
                  <textarea rows={3} className="input-luxury resize-none"
                    placeholder="Dietary requirements, seating preferences, special arrangements..."
                    value={form.specialRequest} onChange={e => setForm(p => ({...p, specialRequest: e.target.value}))} />
                </div>
                {error && <p className="font-sans text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50">
                  {submitting ? 'Confirming...' : 'Reserve Table'}
                </button>
                <p className="font-sans text-[10px] text-charcoal-300 text-center tracking-wide">
                  We will confirm your reservation via WhatsApp within 30 minutes.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
