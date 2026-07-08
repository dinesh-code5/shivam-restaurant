import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

const BG_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80";

export default function About() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative text-white"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <section className="pt-36 pb-20 relative overflow-hidden">
          <div className="container-lux relative z-10">
            <p className="eyebrow text-gold-400 mb-4">Our Story</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-white leading-tight mb-4">
              About<br /><span className="text-gold-400 italic">Shivam Resort</span>
            </h1>
            <div className="w-14 h-px bg-gold-400/40 mb-5" />
            <p className="font-serif text-lg text-cream-100/70 italic max-w-xl">
              A new experience. A new destination. Est. 2026 — Pali, Rajasthan.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="section bg-charcoal-950/65 backdrop-blur-sm border-t border-b border-white/5">
          <div className="container-lux grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="eyebrow text-gold-400 mb-4">Who We Are</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-white mb-5">
                Crafted with Passion,<br />
                <span className="italic text-gold-400">Served with Pride</span>
              </h2>
              <div className="w-12 h-px bg-gold-300 mb-7" />
              <p className="font-serif text-lg text-cream-100/70 italic font-light leading-relaxed mb-5">
                Shivam Resort & Restaurant was born from a simple dream — to create Pali's most welcoming and beautiful destination.
              </p>
              <p className="font-sans text-sm text-white/60 font-light leading-relaxed mb-5">
                Set on Jodhpur Road in Ghumti, Pali, we combine authentic Rajasthani hospitality with the comforts of modern luxury. Our 100% vegetarian and Jain-friendly kitchen celebrates the richness of Indian cuisine without compromise — every dish crafted from fresh, locally sourced ingredients.
              </p>
              <p className="font-sans text-sm text-white/60 font-light leading-relaxed mb-8">
                Beyond dining, Shivam offers beautifully appointed rooms and suites, a grand banquet hall for celebrations, and warm service that makes every guest feel genuinely at home.
              </p>
              <Link to="/contact" className="btn-taj-gold py-3.5 px-8 inline-flex">Get In Touch</Link>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-charcoal-900/60 border border-white/5 aspect-[3/4] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.1),transparent_60%)]" />
                  <div className="text-center p-6 z-10">
                    <svg width="48" height="48" viewBox="0 0 100 100" className="mx-auto mb-3 fill-gold-400/40">
                      <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                    </svg>
                    <p className="font-serif text-gold-300 italic text-base">Fine Dining</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-gold-500/10 border border-gold-400/20 aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-serif text-5xl text-white font-light">5★</p>
                      <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gold-300 mt-1">Service</p>
                    </div>
                  </div>
                  <div className="bg-charcoal-900/50 border border-white/5 flex-1 flex items-center justify-center min-h-[100px]">
                    <div className="text-center p-4">
                      <p className="font-serif text-4xl text-gold-400 font-light">2026</p>
                      <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 mt-1">Established</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="section bg-charcoal-900/55 backdrop-blur-sm border-b border-white/5">
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
                  <div className="glass-luxury p-6 border border-white/10 hover:border-gold-400/30 transition-all duration-300 h-full">
                    <div className="text-3xl mb-4">{v.icon}</div>
                    <h3 className="font-serif text-lg text-gold-300 mb-2">{v.title}</h3>
                    <p className="font-sans text-sm text-white/50 font-light leading-relaxed">{v.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-sm bg-charcoal-950/70 backdrop-blur-sm text-center">
          <div className="container-lux max-w-xl mx-auto">
            <Reveal>
              <p className="eyebrow text-gold-400 mb-3">Plan Your Visit</p>
              <h2 className="font-serif text-4xl text-white font-light mb-5">
                Come Experience<br />
                <span className="italic text-gold-400">Shivam Resort</span>
              </h2>
              <p className="font-sans text-sm text-white/50 font-light mb-8">
                Jodhpur Road, Ghumti, Pali, Rajasthan · @shivam_resort_pali
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/reserve-room" className="btn-taj-gold py-3.5 px-8">Book a Room</Link>
                <Link to="/reserve-table" className="inline-flex items-center justify-center border border-white/20 text-white font-sans font-medium text-[10px] tracking-[0.2em] uppercase px-8 py-4 hover:border-gold-400 hover:text-gold-400 transition-all duration-300">Reserve Table</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
