import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

const ROOMS = [
  { name: 'Deluxe Room', sub: 'Garden View', price: 2500, cap: 2, size: '320 sq ft', amenities: ['AC', 'WiFi', 'Smart TV', 'Hot Water'], badge: 'Most Popular' },
  { name: 'Premium Suite', sub: 'Courtyard View', price: 5500, cap: 4, size: '650 sq ft', amenities: ['AC', 'WiFi', 'Mini Bar', 'Jacuzzi', 'Balcony'], badge: 'Best Value' },
  { name: 'Family Room', sub: 'Resort View', price: 3800, cap: 6, size: '480 sq ft', amenities: ['AC', 'WiFi', 'TV', 'Extra Beds', 'Lounge'], badge: '' },
  { name: 'Banquet Hall', sub: 'Event Venue', price: 25000, cap: 200, size: '3500 sq ft', amenities: ['AC', 'Stage', 'AV System', 'Catering'], badge: 'Grand Events' },
];

const OFFERS = [
  { icon: '🎂', sub: 'Celebrate in Style', title: 'Birthday Special', desc: 'Enjoy 10% off your entire bill on your birthday. Complimentary dessert platter included.' },
  { icon: '🌅', sub: 'Stay & Dine Package', title: 'Weekend Getaway', desc: 'Room + dinner for 2, complimentary breakfast and late checkout on weekends.', featured: true },
  { icon: '👨‍👩‍👧‍👦', sub: 'For 4 Guests & Above', title: 'Family Fiesta', desc: 'Special family package with extra beds, welcome drinks and a curated family thali.' },
];

const MOCK_REVIEWS = [
  { name: 'Rahul Sharma', location: 'Jodhpur', rating: 5, review: 'Absolutely divine experience. The Shivam Special Thali is unlike anything else in Pali. Warm, regal and deeply comforting.', date: 'May 2026' },
  { name: 'Priya Mehta', location: 'Udaipur', rating: 5, review: 'We stayed two nights in the Premium Suite. Immaculate rooms, outstanding food and attentive staff throughout.', date: 'Apr 2026' },
  { name: 'Arvind Gupta', location: 'Jaipur', rating: 5, review: 'Best pure veg fine dining in Rajasthan. The paneer dishes are cooked to perfection. Dal Makhani alone is worth the drive.', date: 'Mar 2026' },
];

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= n ? 'text-gold-400' : 'text-charcoal-100'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

// function QuickBook() {
//   const today = new Date().toISOString().split('T')[0];
//   return (
//     <div className="glass-dark px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-5 items-end">
//       <div>
//         <label className="label-luxury text-cream-100/50">Check In</label>
//         <input type="date" min={today} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors font-sans font-light" />
//       </div>
//       <div>
//         <label className="label-luxury text-cream-100/50">Check Out</label>
//         <input type="date" min={today} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors font-sans font-light" />
//       </div>
//       <div>
//         <label className="label-luxury text-cream-100/50">Guests</label>
//         <select className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none appearance-none font-sans font-light">
//           {[1,2,3,4,'5+'].map(n => <option key={n} value={n} className="bg-charcoal-900">{n} {n===1?'Guest':'Guests'}</option>)}
//         </select>
//       </div>
//       <Link to="/reserve-room" className="btn-primary text-center text-[10px] py-3">
//         Check Availability
//       </Link>
//     </div>
//   );
// }

export default function Home() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [activeReview, setActiveReview] = useState(0);
  const [featuredMenu, setFeaturedMenu] = useState([]);

  useEffect(() => {
    api.get('/menu').then(res => {
      const featured = res.data.data?.filter(i => i.isFeatured).slice(0, 6) || [];
      setFeaturedMenu(featured.length ? featured : res.data.data?.slice(0, 6) || []);
    }).catch(() => {});
    api.get('/feedback/public/approved').then(res => {
      if (res.data.data?.length) setReviews(res.data.data.slice(0, 3));
    }).catch(() => {});
    const t = setInterval(() => setActiveReview(p => (p + 1) % MOCK_REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Navbar />

      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[920px] flex items-end overflow-hidden bg-charcoal-900">
        {/* Rich dark background with gold radial glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(201,162,39,0.16),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,162,39,0.07),transparent_50%)]" />
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5z' fill='none' stroke='%23C9A227' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize:'120px 120px'}} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full pb-20 md:pb-28">
          <div className="container-lux">
            <div className="max-w-2xl">
              <p className="eyebrow text-gold-400 mb-6 anim-fade-up anim-delay-1">
                Jodhpur Road · Ghumti · Pali, Rajasthan
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-light text-white leading-[0.93] tracking-tight mb-6 anim-fade-up anim-delay-2">
                Shivam<br />
                <span className="text-gold-400 italic">Resort &</span><br />
                Restaurant
              </h1>
              <p className="font-serif text-xl md:text-2xl text-cream-100/60 italic font-light mb-10 anim-fade-up anim-delay-3">
                A new experience. A new destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 anim-fade-up anim-delay-4">
                <Link to="/reserve-room" className="btn-primary">Book Your Stay</Link>
                <Link to="/menu" className="btn-outline light">Explore Menu</Link>
              </div>
            </div>
            <div className="mt-12 max-w-3xl anim-fade-up anim-delay-4">
              {/* <QuickBook /> */}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce z-10">
          <span className="font-sans text-[8px] tracking-[0.3em] uppercase">Scroll</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Vertical label right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 text-gold-400/30">
          <div className="h-20 w-px bg-current" />
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase rotate-90 my-4 whitespace-nowrap">Est 2026</span>
          <div className="h-20 w-px bg-current" />
        </div>
      </section>

      {/* ── 2. ABOUT ─────────────────────────────────────── */}
      <section className="section bg-ivory">
        <div className="container-lux">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <p className="eyebrow mb-4">Our Story</p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal-900 leading-tight mb-5">
                Where<br />Rajasthan<br />
                <span className="text-gold-500 italic">Comes Alive</span>
              </h2>
              <div className="ornament text-gold-400/40 mb-6" style={{justifyContent:'flex-start', maxWidth:100}} />
              <p className="font-serif text-lg text-charcoal-500 italic font-light leading-relaxed mb-5">
                Born from a deep reverence for Rajasthani heritage, Shivam Resort & Restaurant is Pali's first truly premium destination.
              </p>
              <p className="font-sans text-sm text-charcoal-400 font-light leading-relaxed mb-8">
                Set on Jodhpur Road in Ghumti, we offer an experience that goes beyond dining and accommodation. Our pure vegetarian and Jain-friendly kitchen celebrates the richness of Indian cuisine without compromise — every dish crafted from fresh, locally sourced ingredients.
              </p>
              <Link to="/about" className="btn-ghost text-charcoal-700 hover:text-gold-500">Discover Our Story</Link>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4 h-[480px]">
                <div className="bg-charcoal-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.15),transparent_60%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg width="56" height="56" viewBox="0 0 100 100" className="mx-auto mb-3" style={{fill:'rgba(201,162,39,0.3)'}}>
                        <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                        <rect x="48" y="50" width="4" height="20" />
                      </svg>
                      <p className="font-serif text-lg text-gold-400 italic">Fine Dining</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-cream-200 flex-1 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="font-serif text-5xl text-charcoal-700 font-light">10+</p>
                      <p className="eyebrow text-charcoal-400 text-[9px] mt-1">Room Types</p>
                    </div>
                  </div>
                  <div className="bg-gold-400 flex-1 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="font-serif text-5xl text-charcoal-900 font-light">28+</p>
                      <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-700 mt-1">Menu Items</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 bg-charcoal-800 relative overflow-hidden" style={{height:140}}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(201,162,39,0.1),transparent_60%)]" />
                  <div className="absolute inset-0 flex items-center px-8">
                    <div>
                      <p className="font-serif text-xl text-gold-300 italic leading-snug">"Hospitality is not a service — it is a feeling."</p>
                      <p className="font-sans text-[10px] text-cream-100/30 mt-2 tracking-wider">— Shivam Resort Philosophy</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. ROOMS ─────────────────────────────────────── */}
      <section className="section bg-cream-100">
        <div className="container-lux">
          <SectionHeading eyebrow="Accommodations" title="Our Rooms & Spaces"
            subtitle="From intimate retreats to grand celebration venues — every space crafted with care." />
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {ROOMS.map((room, i) => (
              <Reveal key={room.name} delay={i * 0.1}>
                <div className="card-luxury bg-white group">
                  <div className="relative h-52 overflow-hidden bg-charcoal-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.12),transparent_60%)]" />
                    {room.badge && (
                      <div className="absolute top-3 left-0 z-10 bg-gold-gradient text-charcoal-900 font-sans font-medium text-[9px] tracking-[0.15em] uppercase px-4 py-1.5">
                        {room.badge}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{background:'linear-gradient(to top,rgba(17,17,17,0.9),transparent)'}}>
                      <p className="font-serif text-xl text-white font-light">{room.name}</p>
                      <p className="font-sans text-[10px] text-gold-300 tracking-wide">{room.sub}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 text-[10px] text-charcoal-400 font-sans">
                        <span>📐 {room.size}</span>
                        <span>👥 {room.cap}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl text-charcoal-900 font-light">₹{room.price.toLocaleString('en-IN')}</p>
                        <p className="font-sans text-[9px] text-charcoal-400">/night</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.amenities.map(a => (
                        <span key={a} className="font-sans text-[9px] text-charcoal-500 bg-cream-100 px-2 py-1">{a}</span>
                      ))}
                    </div>
                    <Link to="/reserve-room" className="btn-primary w-full text-center text-[10px] py-3">
                      Reserve Room
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <Link to="/reserve-room" className="btn-outline dark">View All Accommodations</Link>
          </Reveal>
        </div>
      </section>

      {/* ── 4. RESTAURANT EXPERIENCE ─────────────────────── */}
      <section className="section bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,162,39,0.1),transparent_60%)]" />
        <div className="container-lux relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="eyebrow text-gold-400 mb-4">Dining Experience</p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-5">
                Pure Veg<br />
                <span className="text-gold-400 italic">& Jain</span><br />
                Cuisine
              </h2>
              <div className="ornament text-gold-400/30 mb-6" style={{justifyContent:'flex-start', maxWidth:80}} />
              <p className="font-serif text-lg text-cream-100/55 italic font-light leading-relaxed mb-5">
                An entirely vegetarian and Jain-friendly kitchen rooted in authentic Rajasthani tradition.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {['100% Vegetarian','Jain Options','Fresh Daily','No Onion/Garlic options'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide text-gold-300 border border-gold-400/25 px-3 py-1.5">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {t}
                  </span>
                ))}
              </div>
              <Link to="/menu" className="btn-primary">Explore Full Menu</Link>
            </Reveal>

            {/* Menu items list */}
            <div className="space-y-2.5">
              {(featuredMenu.length ? featuredMenu : [
                {name:'Shivam Special Thali',price:450,category:'Specials',description:'A royal spread of seasonal curries, dal, breads, rice and dessert'},
                {name:'Paneer Butter Masala',price:320,category:'Main Course',description:'Cottage cheese in velvety tomato-butter gravy'},
                {name:'Dal Makhani',price:280,category:'Main Course',description:'Overnight slow-cooked black lentils with cream'},
                {name:'Rabri Falooda',price:160,category:'Desserts',description:'Chilled sweet vermicelli with condensed milk and pistachios'},
                {name:'Veg Dum Biryani',price:280,category:'Rice & Biryani',description:'Fragrant basmati rice slow-cooked with vegetables'},
                {name:'Mango Lassi',price:120,category:'Beverages',description:'Creamy yogurt drink blended with Rajasthani mango'},
              ]).map((item, i) => (
                <Reveal key={item.name} delay={i * 0.07}>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/8 p-4 hover:bg-white/9 hover:border-gold-400/25 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-gold-400/10 border border-gold-400/20 flex-shrink-0 flex items-center justify-center text-base">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-serif text-base text-white">{item.name}</p>
                        <span className="font-sans text-[9px] tracking-wide text-green-400 border border-green-400/30 px-2 py-0.5">Veg</span>
                      </div>
                      <p className="font-sans text-xs text-cream-100/35 truncate">{item.description}</p>
                    </div>
                    <p className="font-serif text-lg text-gold-400 flex-shrink-0">₹{item.price}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.4}>
                <Link to="/menu" className="flex items-center justify-center gap-2 py-3 border border-gold-400/25 text-gold-400 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-gold-400 hover:text-charcoal-900 transition-all duration-300">
                  View Complete Menu →
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DIGITAL MENU PREVIEW ──────────────────────── */}
      <section className="section-sm bg-ivory">
        <div className="container-lux">
          <SectionHeading eyebrow="Digital Menu" title="Featured Selections" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(featuredMenu.length ? featuredMenu : [
              {_id:'1',name:'Shivam Special Thali',price:450,description:'Royal spread of curries, dal, breads and dessert',category:'Specials',type:'Veg'},
              {_id:'2',name:'Paneer Butter Masala',price:320,description:'Velvety tomato-butter gravy with fresh cream',category:'Main Course',type:'Veg'},
              {_id:'3',name:'Dal Makhani',price:280,description:'Overnight slow-cooked black lentils with cream',category:'Main Course',type:'Veg'},
              {_id:'4',name:'Rabri Falooda',price:160,description:'Chilled sweet vermicelli with condensed milk',category:'Desserts',type:'Veg'},
              {_id:'5',name:'Mango Lassi',price:120,description:'Creamy yogurt with Rajasthani mango pulp',category:'Beverages',type:'Veg'},
              {_id:'6',name:'Malai Kulfi',price:130,description:'Hand-churned ice cream with saffron and cardamom',category:'Desserts',type:'Veg'},
            ]).map((item, i) => (
              <Reveal key={item._id || item.name} delay={i * 0.07}>
                <div className="bg-white border border-cream-200 p-5 hover:border-gold-300 hover:shadow-[0_8px_32px_rgba(201,162,39,0.1)] transition-all duration-400 group h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      </div>
                      <span className="font-sans text-[9px] text-green-700 tracking-wide">Veg</span>
                    </div>
                    <p className="font-serif text-xl text-gold-500">₹{item.price}</p>
                  </div>
                  <h3 className="font-serif text-lg text-charcoal-900 font-medium mb-2 group-hover:text-gold-600 transition-colors">{item.name}</h3>
                  <p className="font-sans text-xs text-charcoal-400 font-light leading-relaxed flex-1">{item.description}</p>
                  <div className="mt-4 pt-4 border-t border-cream-100">
                    <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal-400">{item.category}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <Link to="/menu" className="btn-ghost text-gold-500 hover:text-gold-600">Browse Full Menu</Link>
          </Reveal>
        </div>
      </section>

      {/* ── 6. HAPPY CUSTOMERS ───────────────────────────── */}
      <section className="section bg-cream-100">
        <div className="container-lux">
          <SectionHeading eyebrow="Guest Experiences" title="Happy Customers"
            subtitle="Real words from our valued guests." />

          {/* Featured rotating review */}
          <div className="relative max-w-3xl mx-auto text-center mb-12 min-h-[160px]">
            {reviews.map((r, i) => (
              <div key={r.name || i} className="transition-all duration-700"
                style={{ opacity: activeReview === i ? 1 : 0, position: activeReview === i ? 'relative' : 'absolute', top:0, left:0, right:0 }}>
                <div className="text-gold-400 font-serif text-6xl leading-none mb-3">"</div>
                <p className="font-serif text-xl sm:text-2xl md:text-3xl text-charcoal-700 font-light italic leading-relaxed mb-5">
                  {r.review || r.text}
                </p>
                <Stars n={r.rating} />
                <div className="mt-3">
                  <p className="font-sans text-sm font-medium text-charcoal-800 tracking-wide">{r.name || r.customerName}</p>
                  <p className="font-sans text-xs text-charcoal-400">{r.location} · {r.date || new Date(r.visitDate||Date.now()).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-12">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActiveReview(i)}
                className={`transition-all duration-300 ${i === activeReview ? 'w-8 h-1.5 bg-gold-400' : 'w-1.5 h-1.5 rounded-full bg-charcoal-200'}`} />
            ))}
          </div>

          {/* Review cards */}
          <div className="grid sm:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <Reveal key={r.name || i} delay={i * 0.1}>
                <div className="bg-white border border-cream-200 p-6 hover:border-gold-300 transition-all duration-300 h-full flex flex-col">
                  <Stars n={r.rating} />
                  <p className="font-serif text-sm text-charcoal-600 italic leading-relaxed mt-3 mb-4 flex-1">"{r.review || r.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-cream-100">
                    <div className="w-9 h-9 bg-gold-gradient flex items-center justify-center font-serif text-charcoal-900 font-semibold text-sm flex-shrink-0">
                      {(r.name || r.customerName || 'G').charAt(0)}
                    </div>
                    <div>
                      <p className="font-sans text-xs font-medium text-charcoal-800">{r.name || r.customerName}</p>
                      <p className="font-sans text-[10px] text-charcoal-400">{r.location} · {r.date || new Date(r.visitDate||Date.now()).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. GALLERY ───────────────────────────────────── */}
      <section className="section-sm bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="container-lux relative z-10">
          <SectionHeading eyebrow="Visual Journey" title="Gallery"
            subtitle="A glimpse into the world of Shivam Resort & Restaurant." light />
          <div className="grid grid-cols-3 gap-2.5" style={{gridTemplateRows:'auto'}}>
            {[
              {label:'Grand Courtyard',span:'col-span-2 row-span-2',h:'h-80'},
              {label:'Signature Thali',span:'col-span-1',h:'h-40'},
              {label:'Premium Suite',span:'col-span-1',h:'h-40'},
              {label:'Banquet Setup',span:'col-span-1 row-span-2',h:'h-80'},
              {label:'Garden Seating',span:'col-span-1',h:'h-40'},
              {label:'Paneer Tikka',span:'col-span-1',h:'h-40'},
            ].map((item, i) => (
              <Reveal key={i} delay={i*0.07}
                className={`${item.span} ${item.h} relative overflow-hidden bg-charcoal-800 group cursor-pointer`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(201,162,39,0.1),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-25 transition-opacity duration-500">
                  <svg width="50" height="50" viewBox="0 0 100 100" fill="rgba(201,162,39,0.9)">
                    <path d="M50 10 C 55 25, 65 30, 75 28 C 65 35, 60 45, 50 55 C 40 45, 35 35, 25 28 C 35 30, 45 25, 50 10 Z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/45 transition-all duration-400 flex items-end p-4">
                  <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-8">
            <Link to="/gallery" className="btn-outline light">View Full Gallery</Link>
          </Reveal>
        </div>
      </section>

      {/* ── 8. SPECIAL OFFERS ────────────────────────────── */}
      <section className="section bg-ivory">
        <div className="container-lux">
          <SectionHeading eyebrow="Exclusive" title="Special Offers"
            subtitle="Crafted experiences for every celebration." />
          <div className="grid md:grid-cols-3 gap-5">
            {OFFERS.map((offer, i) => (
              <Reveal key={offer.title} delay={i * 0.12}>
                <div className={`relative overflow-hidden p-8 h-full flex flex-col hover:shadow-luxury transition-all duration-400 ${
                  offer.featured ? 'bg-charcoal-900 text-white' : 'bg-white border border-cream-200'
                }`}>
                  {offer.featured && (
                    <span className="absolute top-4 right-4 bg-gold-gradient text-charcoal-900 font-sans text-[9px] font-medium tracking-[0.15em] uppercase px-3 py-1">Popular</span>
                  )}
                  <div className="text-3xl mb-4">{offer.icon}</div>
                  <p className={`eyebrow mb-2 ${offer.featured ? 'text-gold-400' : 'text-gold-500'}`}>{offer.sub}</p>
                  <h3 className={`font-serif text-2xl font-light mb-3 ${offer.featured ? 'text-white' : 'text-charcoal-900'}`}>{offer.title}</h3>
                  <p className={`font-sans text-sm font-light leading-relaxed flex-1 mb-6 ${offer.featured ? 'text-cream-100/55' : 'text-charcoal-400'}`}>{offer.desc}</p>
                  <Link to="/contact" className={`btn-ghost ${offer.featured ? 'text-gold-400 hover:text-gold-300' : 'text-charcoal-600 hover:text-gold-500'}`}>
                    Enquire Now
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CONTACT & LOCATION ────────────────────────── */}
      <section className="section-sm bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="container-lux relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="eyebrow text-gold-400 mb-4">Find Us</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-white mb-5">
                Come Visit<br /><span className="text-gold-400 italic">Shivam Resort</span>
              </h2>
              <div className="ornament text-gold-400/20 mb-6" style={{justifyContent:'flex-start', maxWidth:70}} />
              <div className="space-y-5 mt-2">
                {[
                  {icon:'📍', label:'Address', val:'Jodhpur Road, Ghumti, Pali, Rajasthan'},
                  {icon:'📞', label:'Phone', val:'+91 00000 00000'},
                  {icon:'✉️', label:'Email', val:'info@shivamresort.com'},
                  {icon:'🕐', label:'Hours', val:'Restaurant 7am–11pm · Reception 24hrs'},
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-gold-400/25 flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="eyebrow text-gold-400/50 text-[8px] mb-0.5">{item.label}</p>
                      <p className="font-sans text-sm text-cream-100/60 font-light">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/contact" className="btn-primary">Get in Touch</Link>
                <Link to="/reserve-table" className="btn-outline light">Reserve Table</Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="h-80 lg:h-96 bg-charcoal-800 border border-gold-400/15 overflow-hidden relative">
                <iframe title="Shivam Resort Location" className="w-full h-full" loading="lazy"
                  style={{filter:'grayscale(0.8) opacity(0.7)'}}
                  src="https://www.google.com/maps?q=Jodhpur+Road,+Ghumti,+Pali,+Rajasthan&output=embed" />
                <div className="absolute bottom-4 left-4 glass-dark px-4 py-2.5">
                  <p className="font-serif text-sm text-white">Shivam Resort & Restaurant</p>
                  <p className="eyebrow text-gold-400 text-[8px] mt-0.5">Pali, Rajasthan</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="bg-gold-gradient py-14">
        <div className="container-lux text-center">
          <Reveal>
            <p className="eyebrow text-charcoal-700 mb-3">Plan Your Visit</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal-900 mb-3">
              Your Perfect Stay Awaits
            </h2>
            <p className="font-serif text-lg text-charcoal-700 italic font-light mb-8 max-w-md mx-auto">
              Book directly for the best rates and a personal welcome from our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reserve-room"
                className="inline-flex items-center justify-center bg-charcoal-900 text-white font-sans font-medium text-[10px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-charcoal-800 transition-colors">
                Book a Room
              </Link>
              <Link to="/reserve-table"
                className="inline-flex items-center justify-center border border-charcoal-900 text-charcoal-900 font-sans font-medium text-[10px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-charcoal-900 hover:text-white transition-all">
                Reserve a Table
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
