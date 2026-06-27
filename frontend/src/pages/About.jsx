import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

export default function About() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,rgba(201,162,39,0.12),transparent_60%)]" />
        <div className="container-lux relative z-10">
          <p className="eyebrow text-gold-400 mb-4">Our Story</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight mb-4">
            About<br /><span className="text-gold-400 italic">Shivam Resort</span>
          </h1>
          <div className="w-14 h-px bg-gold-400/40 mb-5" />
          <p className="font-serif text-lg text-cream-100/55 italic max-w-xl">
            A new experience. A new destination. Est. 2026 — Pali, Rajasthan.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-ivory">
        <div className="container-lux grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="eyebrow text-gold-500 mb-4">Who We Are</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 mb-5">
              Crafted with Passion,<br />
              <span className="italic text-gold-500">Served with Pride</span>
            </h2>
            <div className="w-12 h-px bg-gold-300 mb-7" />
            <p className="font-serif text-lg text-charcoal-500 italic font-light leading-relaxed mb-5">
              Shivam Resort & Restaurant was born from a simple dream — to create Pali's most welcoming and beautiful destination.
            </p>
            <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed mb-5">
              Set on Jodhpur Road in Ghumti, Pali, we combine authentic Rajasthani hospitality with the comforts of modern luxury. Our 100% vegetarian and Jain-friendly kitchen celebrates the richness of Indian cuisine without compromise — every dish crafted from fresh, locally sourced ingredients.
            </p>
            <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed mb-8">
              Beyond dining, Shivam offers beautifully appointed rooms and suites, a grand banquet hall for celebrations, and warm service that makes every guest feel genuinely at home.
            </p>
            <Link to="/contact" className="btn-primary inline-flex">Get In Touch</Link>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-charcoal-900 aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.14),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <svg width="48" height="48" viewBox="0 0 100 100" className="mx-auto mb-3" style={{fill:'rgba(201,162,39,0.35)'}}>
                      <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                    </svg>
                    <p className="font-serif text-gold-400 italic text-base">Fine Dining</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-gold-400 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-serif text-5xl text-charcoal-900 font-light">5★</p>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-700 mt-1">Service</p>
                  </div>
                </div>
                <div className="bg-cream-200 flex-1 flex items-center justify-center min-h-[100px]">
                  <div className="text-center p-4">
                    <p className="font-serif text-4xl text-charcoal-700 font-light">2026</p>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-400 mt-1">Established</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="container-lux relative z-10">
          <SectionHeading eyebrow="Our Promise" title="What We Stand For" light />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:'🍃', title:'Pure Vegetarian', desc:'100% vegetarian and Jain-friendly kitchen. No compromise on tradition or flavour.' },
              { icon:'🏡', title:'Genuine Hospitality', desc:'Warm, attentive service rooted in Rajasthani values. Every guest is family.' },
              { icon:'✨', title:'Crafted Quality', desc:'Fresh ingredients, daily preparations, and recipes passed through generations.' },
              { icon:'🌿', title:'Sustainable Practices', desc:'Locally sourced produce, minimal waste kitchen, and eco-conscious operations.' },
              { icon:'🎉', title:'Grand Celebrations', desc:'From intimate dinners to grand weddings — we curate every celebration with care.' },
              { icon:'🛏️', title:'Luxurious Comfort', desc:'Thoughtfully designed rooms and suites for rest, rejuvenation and romance.' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="border border-white/8 p-6 hover:border-gold-400/30 hover:bg-white/[0.03] transition-all duration-300 h-full">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="font-serif text-lg text-gold-300 mb-2">{v.title}</h3>
                  <p className="font-sans text-sm text-cream-100/45 font-light leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-ivory text-center">
        <div className="container-lux max-w-xl mx-auto">
          <Reveal>
            <p className="eyebrow text-gold-500 mb-3">Plan Your Visit</p>
            <h2 className="font-serif text-4xl text-charcoal-900 font-light mb-5">
              Come Experience<br />
              <span className="italic text-gold-500">Shivam Resort</span>
            </h2>
            <p className="font-sans text-sm text-charcoal-400 font-light mb-8">
              Jodhpur Road, Ghumti, Pali, Rajasthan · @shivam_resort_pali
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reserve-room" className="btn-primary">Book a Room</Link>
              <Link to="/reserve-table" className="btn-outline dark">Reserve Table</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
