import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-charcoal-900 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <p className="eyebrow text-gold-400 mb-3">Page Not Found</p>
          <h1 className="font-serif text-[120px] sm:text-[180px] font-light text-white/10 leading-none mb-0">404</h1>
          <p className="font-serif text-2xl sm:text-3xl text-white -mt-4 mb-3 italic">The page you seek does not exist.</p>
          <p className="font-sans text-sm text-cream-100/40 font-light mb-10">Let us guide you back to comfort.</p>
          <Link to="/" className="btn-primary inline-flex">Return Home</Link>
        </div>
      </div>
    </>
  );
}
