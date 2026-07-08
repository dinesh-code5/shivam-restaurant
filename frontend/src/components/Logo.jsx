 const Logo = ({ light = true, size = 'md' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-[22px]',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center justify-center leading-none select-none text-center group">
      {/* Detailed Royal Crest SVG resembling a luxury hotel crest */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        className={`mb-1 transition-colors duration-300 ${light ? 'text-white fill-current' : 'text-gold-400 fill-current'}`}
      >
        {/* Elegant traditional royal star/mandala design */}
        <path d="M50 8 C52 20 58 24 70 18 C62 28 64 36 78 33 C66 40 66 48 82 48 C66 48 66 56 82 63 C64 60 62 68 70 78 C58 72 52 76 50 88 C48 72 42 76 30 78 C38 68 36 60 18 63 C34 56 34 48 18 48 C34 48 34 40 18 33 C36 36 38 28 30 18 C42 24 48 20 50 8 Z" />
        <circle cx="50" cy="48" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" className={light ? 'stroke-gold-300' : 'stroke-gold-600'} />
        <circle cx="50" cy="48" r="4.5" className={light ? 'fill-gold-300' : 'fill-gold-600'} />
      </svg>
      {/* SHIVAM Wordmark */}
      <span className={`font-serif font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ${sizes[size]} ${light ? 'text-white' : 'text-gold-400'}`}>
        SHIVAM
      </span>
    </div>
  );
};

export default Logo;
