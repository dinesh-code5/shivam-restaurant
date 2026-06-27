import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, subtitle, light = false, center = true }) {
  return (
    <Reveal className={`mb-12 ${center ? 'text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow mb-3 ${light ? 'text-gold-300' : 'text-gold-500'}`}>{eyebrow}</p>}
      <h2 className={`font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-tight ${light ? 'text-white' : 'text-charcoal-900'}`}>
        {title}
      </h2>
      <div className={`ornament my-5 ${center ? 'justify-center' : ''} ${light ? 'text-gold-400/50' : 'text-gold-400'}`}>
        <span className="text-gold-400 text-sm">◆</span>
      </div>
      {subtitle && (
        <p className={`font-serif text-lg italic font-light max-w-xl ${center ? 'mx-auto' : ''} ${light ? 'text-cream-100/60' : 'text-charcoal-500'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
