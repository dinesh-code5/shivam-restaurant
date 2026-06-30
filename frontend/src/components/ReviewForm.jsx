import { useState } from 'react';
import api from '../api/axios';

export default function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState({ customerName: '', rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/feedback/submit-general', form);
      setMessage('Thank you for your feedback!');
      setForm({ customerName: '', rating: 5, review: '' });
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setMessage('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-cream-200">
      <h3 className="font-serif text-xl text-charcoal-900 mb-4">Share Your Experience</h3>
      <div className="space-y-4">
        <input className="input-luxury" placeholder="Your Name" value={form.customerName} onChange={e => setForm(p => ({...p, customerName: e.target.value}))} required />
        
        <div className="flex gap-2">
            {[1,2,3,4,5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => setForm(p => ({...p, rating: n}))}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                >
                    <svg className={`w-8 h-8 transition-colors ${n <= (hoverRating || form.rating) ? 'text-gold-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                </button>
            ))}
        </div>

        <textarea className="input-luxury" placeholder="Your Review" value={form.review} onChange={e => setForm(p => ({...p, review: e.target.value}))} required />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        {message && <p className="font-sans text-sm text-center mt-2">{message}</p>}
      </div>
    </form>
  );
}
