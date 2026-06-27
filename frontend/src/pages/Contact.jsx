import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import api from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Required';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/contact', form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Message could not be sent. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <Navbar />

      <section className="bg-charcoal-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="container-lux relative z-10 text-center">
          <p className="eyebrow text-gold-400 mb-4">Get In Touch</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white mb-4">Contact Us</h1>
          <div className="w-14 h-px bg-gold-400/40 mx-auto mb-5" />
          <p className="font-serif text-lg text-cream-100/55 italic">We would love to hear from you.</p>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-lux grid lg:grid-cols-2 gap-16">

          {/* Info */}
          <Reveal>
            <p className="eyebrow text-gold-500 mb-4">Reach Out</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-light mb-5">
              We Are Here<br /><span className="italic text-gold-500">For You</span>
            </h2>
            <div className="w-10 h-px bg-gold-300 mb-8" />
            <div className="space-y-5 mb-10">
              {[
                ['📍','Address','Jodhpur Road, Ghumti, Pali, Rajasthan'],
                ['📞','Phone','+91 00000 00000'],
                ['✉️','Email','info@shivamresort.com'],
                ['📷','Instagram','@shivam_resort_pali'],
                ['🕐','Hours','Restaurant: 7am – 11pm\nReception: 24 hours'],
              ].map(([icon,label,val]) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold-300 flex items-center justify-center text-base flex-shrink-0">{icon}</div>
                  <div>
                    <p className="eyebrow text-gold-500/60 text-[8px] mb-0.5">{label}</p>
                    <p className="font-sans text-sm text-charcoal-500 font-light whitespace-pre-line">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-52 bg-cream-100 border border-cream-200 overflow-hidden">
              <iframe title="Map" className="w-full h-full" loading="lazy"
                style={{filter:'grayscale(0.4)'}}
                src="https://www.google.com/maps?q=Jodhpur+Road,+Ghumti,+Pali,+Rajasthan&output=embed" />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.15}>
            {done ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 bg-gold-gradient mx-auto mb-5 flex items-center justify-center">
                    <svg className="w-7 h-7 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-charcoal-900 mb-3">Message Sent</h3>
                  <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed">
                    Thank you for reaching out. Our team will respond within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="eyebrow text-gold-500 mb-4">Send A Message</p>
                <h2 className="font-serif text-3xl text-charcoal-900 font-light mb-8">Write To Us</h2>
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid sm:grid-cols-2 gap-7">
                    <div>
                      <label className="label-luxury">Full Name *</label>
                      <input className="input-luxury" placeholder="Your name" value={form.name}
                        onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                      {errors.name && <p className="font-sans text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label-luxury">Email *</label>
                      <input type="email" className="input-luxury" placeholder="you@example.com" value={form.email}
                        onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                      {errors.email && <p className="font-sans text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-7">
                    <div>
                      <label className="label-luxury">Phone</label>
                      <input type="tel" className="input-luxury" placeholder="+91 XXXXX XXXXX" value={form.phone}
                        onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
                    </div>
                    <div>
                      <label className="label-luxury">Subject</label>
                      <input className="input-luxury" placeholder="How can we help?" value={form.subject}
                        onChange={e => setForm(p => ({...p, subject: e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="label-luxury">Message *</label>
                    <textarea rows={4} className="input-luxury resize-none" placeholder="Tell us about your enquiry..."
                      value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
                    {errors.message && <p className="font-sans text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  {error && <p className="font-sans text-sm text-red-500">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
