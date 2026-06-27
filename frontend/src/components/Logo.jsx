const Logo = ({ light = false, size = 'md' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center leading-none select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 100 100"
        className={`mb-1 ${light ? 'fill-gold-300' : 'fill-charcoal-900'}`}
      >
        <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
        <rect x="48" y="50" width="4" height="20" />
      </svg>
      <span className={`font-display font-extrabold tracking-wider ${sizes[size]} ${light ? 'text-cream-50' : 'text-charcoal-900'}`}>
        SHIVAM
      </span>
      <span className={`font-body text-[0.55em] tracking-[0.3em] -mt-0.5 ${light ? 'text-gold-300' : 'text-gold-500'}`}>
        RESTAURANT
      </span>
    </div>
  );
};

export default Logo;
