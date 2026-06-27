import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Logo from '../components/Logo';

const FeedbackPage = () => {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/feedback/token/${token}`);
        setInfo(res.data.data);
        setName(res.data.data.customerName || '');
        if (res.data.data.alreadySubmitted) setSubmitted(true);
      } catch {
        setInvalid(true);
      } finally { setLoading(false); }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a rating.'); return; }
    if (!review.trim()) { setError('Please write a review.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/feedback', { token, customerName: name, rating, review });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo light size="md" /></div>

        {loading && (
          <div className="text-center text-cream-100/70">
            <div className="spinner mx-auto mb-3"></div>
            <p>Loading feedback form...</p>
          </div>
        )}

        {invalid && (
          <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-cream-50 font-display text-xl font-semibold">Invalid Link</p>
            <p className="text-cream-100/60 text-sm mt-2">This feedback link is invalid or has expired.</p>
          </div>
        )}

        {submitted && !loading && (
          <div className="bg-green-900/30 border border-green-500/40 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">🙏</p>
            <p className="text-gold-300 font-display text-2xl font-bold">Thank You!</p>
            <p className="text-cream-100/70 text-sm mt-2">Your feedback has been submitted. We truly appreciate your time!</p>
            <p className="text-cream-100/50 text-xs mt-4">— Shivam Resort & Restaurant</p>
          </div>
        )}

        {!loading && !invalid && !submitted && (
          <div className="bg-charcoal-800/80 border border-gold-400/30 rounded-2xl p-6 sm:p-8 shadow-gold-lg">
            <h1 className="font-display text-2xl font-bold text-cream-50 text-center mb-1">Share Your Experience</h1>
            <p className="text-cream-100/60 text-sm text-center mb-6">Your feedback helps us serve you better</p>

            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-field text-cream-100">Your Name</label>
                <input className="input-field bg-charcoal-900 border-gold-400/30 text-cream-50 placeholder-cream-100/30"
                  value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>

              <div>
                <label className="label-field text-cream-100">Rating *</label>
                <div className="flex gap-2 mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(s)}
                      className={`text-4xl transition-transform hover:scale-110 ${s <= (hover || rating) ? 'text-gold-400' : 'text-charcoal-600'}`}>
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-gold-300 text-xs mt-1">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </p>
                )}
              </div>

              <div>
                <label className="label-field text-cream-100">Your Review *</label>
                <textarea rows={4} className="input-field bg-charcoal-900 border-gold-400/30 text-cream-50 placeholder-cream-100/30 resize-none"
                  value={review} onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about your experience at Shivam Restaurant..." />
              </div>

              <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
