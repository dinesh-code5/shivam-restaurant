import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Required';
    if (!form.password) e.password = 'Required';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,162,39,0.1),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-sc text-3xl text-white tracking-[0.15em] uppercase mb-0.5">Shivam</p>
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold-400">Resort & Restaurant</p>
          <div className="w-8 h-px bg-gold-400/40 mx-auto mt-4" />
        </div>

        <div className="bg-charcoal-900/80 border border-gold-400/15 backdrop-blur-md p-8">
          <h1 className="font-serif text-2xl text-white font-light text-center mb-1">Admin Login</h1>
          <p className="font-sans text-[10px] text-cream-100/35 text-center tracking-wide mb-7">Sign in to manage your property</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-900/25 border border-red-500/25 text-red-400 font-sans text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-luxury text-cream-100/40">Email Address</label>
              <input type="email" value={form.email}
                onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email:''})); }}
                className="w-full bg-transparent border-b border-white/15 py-2.5 text-sm text-white font-sans font-light placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="example@gmail.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-sans">{errors.email}</p>}
            </div>
            <div>
              <label className="label-luxury text-cream-100/40">Password</label>
              <input type="password" value={form.password}
                onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password:''})); }}
                className="w-full bg-transparent border-b border-white/15 py-2.5 text-sm text-white font-sans font-light placeholder:text-white/20 focus:outline-none focus:border-gold-400 transition-colors"
                placeholder="••••••••" />
              {errors.password && <p className="text-red-400 text-xs mt-1 font-sans">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="font-sans text-[9px] text-cream-100/20 text-center mt-6 tracking-wide">
            Default: admin@shivamrestaurant.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}
