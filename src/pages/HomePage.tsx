import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Star, Award, ArrowRight, Sparkles, Upload, Search, PenTool, Zap, Recycle, Wrench, Clock, MapPin, CreditCard, Phone } from 'lucide-react';
import { supabase, formatPrice } from '../lib';
import type { Product, Collection, Review } from '../types';
import { navigate } from '../router';
import { ProductCard } from '../components/ProductCard';
import { StarRating } from '../components/StarRating';
import { DesignCard } from '../components/DesignCard';
import { SectionDivider } from '../components/SectionDivider';
import { FEATURED_DESIGNS, MORE_DESIGNS } from '../designs';
import { useReveal } from '../useReveal';

const CATEGORIES = [
  { name: 'Plant Walls', slug: 'garden', img: 'https://images.pexels.com/photos/10841918/pexels-photo-10841918.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Business Signs', slug: 'business-signs', img: 'https://images.pexels.com/photos/11123312/pexels-photo-11123312.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Desktop Neon Signs', slug: 'desktop-neon-sign', img: 'https://images.pexels.com/photos/942317/pexels-photo-942317.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Neon Led Chandeliers', slug: 'neon-led-chandeliers', img: 'https://images.pexels.com/photos/6835984/pexels-photo-6835984.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Neon Led Sculptures', slug: 'sculpture', img: 'https://images.pexels.com/photos/5820026/pexels-photo-5820026.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Neon Tables', slug: 'neon-table', img: 'https://images.pexels.com/photos/34965559/pexels-photo-34965559.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Magic Leds & Curtain', slug: 'magic-leds-curtain', img: 'https://images.pexels.com/photos/6835976/pexels-photo-6835976.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const COLLECTION_CATS = [
  { name: 'Neon Led Basketball Hoops', slug: 'neon-led-basketball-hoops-1', img: 'https://images.pexels.com/photos/13900890/pexels-photo-13900890.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Neon Led Mirrors', slug: 'neon-mirror', img: 'https://images.pexels.com/photos/5704731/pexels-photo-5704731.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Neon Led Infinity Mirrors', slug: 'neon-infinity-mirror-table', img: 'https://images.pexels.com/photos/29506609/pexels-photo-29506609.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: '3D Neon Led Artworks', slug: 'neon-led-basketball-hoops', img: 'https://images.pexels.com/photos/11796003/pexels-photo-11796003.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Acrylic Sign', slug: 'gold-sign', img: 'https://images.pexels.com/photos/14197796/pexels-photo-14197796.jpeg?auto=compress&cs=tinysrgb&w=600' },
];



const BLOG_POSTS = [
  {
    title: 'The Contribution of LED Neon Lights to Architectural Details: Light Games',
    excerpt: 'With the flexibility of LED neon and its variety of colour options, architectural details can be emphasised in unique ways...',
    img: 'https://images.pexels.com/photos/2626770/pexels-photo-2626770.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Sliding Neon LEDs: The New Life of Light',
    excerpt: 'Lighting technology is undergoing a major evolution today. We\'ve transitioned from traditional halogen lamps to incandescent bulbs and then to compact fluorescent lamps...',
    img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Can Neon LED Signs Be Repaired?',
    excerpt: 'Our company takes pride in the quality and durability of the LED neon signs we offer. Our guaranteed repair service ensures your sign lasts a lifetime...',
    img: 'https://images.pexels.com/photos/31338031/pexels-photo-31338031.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useReveal();

  

  useEffect(() => {
    (async () => {
      const [{ data: prods }, { data: cols }, { data: revs }] = await Promise.all([
        supabase.from('products').select('*').limit(8),
        supabase.from('collections').select('*').limit(6),
        supabase.from('reviews').select('*').limit(5),
      ]);
      setProducts(prods ?? []);
      setCollections(cols ?? []);
      setReviews(revs ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
    {/* HERO */}
<section className="relative overflow-hidden py-10 sm:py-14 lg:py-18 min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
  {/* Dark gradient bg */}
  <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #09090f 0%, #12101e 35%, #1a082e 60%, #0d0d18 85%, #08080c 100%)' }} />
  
  {/* Subtle Background Grid Lines */}
  <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

  {/* Thin Glowing Neonic Lines in Background */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--neon-pink)] to-transparent opacity-40 shadow-[0_0_15px_var(--neon-pink)]" style={{ top: '25%' }} />
    <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--neon-blue)] to-transparent opacity-40 shadow-[0_0_15px_var(--neon-blue)]" style={{ top: '75%' }} />
    <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--neon-purple)] to-transparent opacity-30 left-1/3" />
    <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--neon-pink)] to-transparent opacity-30 right-1/3" />
  </div>

  {/* Ambient glowing radial light blobs */}
  <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] opacity-20 pointer-events-none rounded-full blur-[130px] animate-pulse" style={{ background: 'var(--neon-pink)', animationDuration: '6s' }} />
  <div className="absolute bottom-1/4 left-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] opacity-20 pointer-events-none rounded-full blur-[130px] animate-pulse" style={{ background: 'var(--neon-blue)', animationDuration: '8s' }} />

  <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center w-full my-auto">
    {/* Badge Pill */}
    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[var(--neon-pink)]/30 shadow-[0_0_15px_rgba(255,45,149,0.15)] mb-3 sm:mb-5 animate-fade-in-down">
      <span className="w-2 h-2 rounded-full bg-[var(--neon-pink)] animate-ping" />
      <span className="text-[10px] sm:text-xs font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[var(--neon-pink)] uppercase">
        Handcrafted LED Neon Masterpieces
      </span>
    </div>

    {/* Stunning Heading with Moving Text Glow Effects */}
    <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
      Custom LED Neon Signs,
      <br />
      <span className="relative inline-block mt-1">
        <span className="absolute inset-0 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-blue)] to-[var(--neon-purple)] opacity-50 blur-lg pointer-events-none" />
        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)] drop-shadow-[0_0_25px_rgba(255,45,149,0.3)]">
          Love at First Light!
        </span>
      </span>
    </h1>

    {/* Description */}
    <p className="text-gray-300 text-xs sm:text-sm lg:text-base max-w-xl mx-auto mt-2 sm:mt-3 leading-relaxed animate-fade-in-up px-1" style={{ animationDelay: '0.15s' }}>
      Transform your space with ultra-bright, energy-efficient handcrafted LED neon. From custom text to bespoke logos, from design to delivery.
    </p>

    {/* Fully spread maxed out cards on small screens and grid layout on larger screens */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6 mt-4 sm:mt-8 lg:mt-10 text-left">
      {/* Design Your Own */}
      <button
        onClick={() => navigate('/customiser')}
        className="group relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-b from-white/15 to-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer flex flex-col w-full"
      >
        <div className="relative h-full w-full rounded-[15px] bg-[#101018]/95 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          <div className="w-full aspect-[21/9] sm:aspect-[16/10] overflow-hidden relative bg-black/40">
            <img
              src="https://m.media-amazon.com/images/I/81qprFaRMyL._AC_SX679_.jpg"
              alt="Design Your Own"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
          <div className="p-3.5 sm:p-5 flex flex-col flex-grow justify-between bg-[#0e0e14]">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base group-hover:text-[var(--neon-pink)] transition-colors">Design Your Own</h3>
              <p className="text-gray-400 text-xs mt-0.5 sm:mt-1 leading-relaxed">Use our live interactive builder to create something truly unique.</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--neon-pink)] group-hover:gap-2 transition-all">
              <span>Start Designing</span>
              <div className="w-5 h-5 rounded-full bg-[var(--neon-pink)]/10 flex items-center justify-center group-hover:bg-[var(--neon-pink)] group-hover:text-white transition-all shadow-[0_0_6px_var(--neon-pink)]">
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Upload Your Design */}
      <button
        onClick={() => navigate('/logo-upload')}
        className="group relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-b from-white/15 to-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer flex flex-col w-full"
      >
        <div className="relative h-full w-full rounded-[15px] bg-[#101018]/95 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          <div className="w-full aspect-[21/9] sm:aspect-[16/10] overflow-hidden relative bg-black/40">
            <img
              src="https://www.a-m-c.com.au/wp-content/uploads/2023/12/custom-neon-sign-Australia1.jpg"
              alt="Upload Your Design"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
          <div className="p-3.5 sm:p-5 flex flex-col flex-grow justify-between bg-[#0e0e14]">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base group-hover:text-[var(--neon-purple)] transition-colors">Upload Your Design</h3>
              <p className="text-gray-400 text-xs mt-0.5 sm:mt-1 leading-relaxed">Fast quotes and digital mockups for company logos, artwork &amp; sketches.</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--neon-purple)] group-hover:gap-2 transition-all">
              <span>Get a Quote</span>
              <div className="w-5 h-5 rounded-full bg-[var(--neon-purple)]/10 flex items-center justify-center group-hover:bg-[var(--neon-purple)] group-hover:text-white transition-all shadow-[0_0_6px_var(--neon-purple)]">
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Browse Ideas */}
      <button
        onClick={() => navigate('/more-designs')}
        className="group relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-b from-white/15 to-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer flex flex-col w-full sm:col-span-2 md:col-span-1"
      >
        <div className="relative h-full w-full rounded-[15px] bg-[#101018]/95 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          <div className="w-full aspect-[21/9] sm:aspect-[16/10] overflow-hidden relative bg-black/40">
            <img
              src="https://dopeneons.com/cdn/shop/products/pinkmockupcopy_d115afe8-4c0c-4ba8-bba1-1265790e5fda_1024x1024.jpg?v=1666609051"
              alt="Browse Ideas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
          <div className="p-3.5 sm:p-5 flex flex-col flex-grow justify-between bg-[#0e0e14]">
            <div>
              <h3 className="text-white font-extrabold text-sm sm:text-base group-hover:text-[var(--neon-blue)] transition-colors">Browse Ideas</h3>
              <p className="text-gray-400 text-xs mt-0.5 sm:mt-1 leading-relaxed">Explore ready-to-ship curated designs, home decor, and wedding inspiration.</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--neon-blue)] group-hover:gap-2 transition-all">
              <span>View All</span>
              <div className="w-5 h-5 rounded-full bg-[var(--neon-blue)]/10 flex items-center justify-center group-hover:bg-[var(--neon-blue)] group-hover:text-white transition-all shadow-[0_0_6px_var(--neon-blue)]">
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</section>
      <SectionDivider />

     
{/* READY TO CREATE CTA */}
<section className="relative overflow-hidden py-20 lg:py-28 bg-[#0a0a0f] border-y border-white/10">
  {/* Moving Grid Lines Background Effect */}
  <div className="absolute inset-0 pointer-events-none z-0 opacity-25 bg-[linear-gradient(to_right,rgba(255,45,149,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-pulse" style={{ animationDuration: '4s' }} />

  {/* Neonic Gradient Moving Objects / Orbs */}
  <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-[var(--neon-pink)]/30 blur-[140px] rounded-full pointer-events-none animate-bounce" style={{ animationDuration: '9s' }} />
  <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[var(--neon-blue)]/25 blur-[150px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--neon-purple)]/20 blur-[130px] rounded-full pointer-events-none" />

  {/* RGB Gradient Lines */}
  <div className="rgb-gradient-line animate-pulse" style={{ top: 0 }} />
  <div className="rgb-gradient-line rgb-gradient-line-bottom animate-pulse" style={{ bottom: 0 }} />

  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
    {/* Glassmorphic Badge with Onload Animation */}
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-inner animate-fade-in-down">
      <span className="w-2 h-2 rounded-full bg-[var(--neon-pink)] animate-ping" />
      <span className="text-white/90 uppercase tracking-[0.2em] text-[11px] font-bold">LIMITED TIME OFFER • FREE EXPRESS SHIPPING</span>
    </div>

    {/* Main Headline with Onload Animation */}
    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
      Ready to Create <br className="hidden sm:block" />
      <span className="relative inline-block mt-1">
        <span className="absolute inset-0 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-blue)] to-[var(--neon-purple)] opacity-60 blur-xl pointer-events-none" />
        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)]">
          Something Amazing?
        </span>
      </span>
    </h2>
    
    <p className="text-gray-300 mt-4 text-base sm:text-lg max-w-xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
      Design your own custom LED neon sign in minutes with our interactive 3D builder.
    </p>

    {/* CTA Buttons with Neonic Hover Effects */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
      <button
        onClick={() => navigate('/customiser')}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 shadow-[0_0_20px_rgba(255,45,149,0.4)] hover:shadow-[0_0_35px_rgba(255,45,149,0.8)] hover:-translate-y-1 active:translate-y-0 border border-[var(--neon-pink)]/50 cursor-pointer"
        style={{ background: 'var(--neon-pink)' }}
      >
        Design Your Own Sign <ArrowRight size={18} />
      </button>

      <button
        onClick={() => navigate('/logo-upload')}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-xl font-semibold text-white text-base bg-white/10 border border-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-[var(--neon-purple)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:-translate-y-1 cursor-pointer"
      >
        Upload Your Logo <Upload size={18} />
      </button>

      <button
        onClick={() => navigate('/more-designs')}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-xl font-semibold text-white text-base bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-[var(--neon-blue)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:-translate-y-1 cursor-pointer"
      >
        Browse Collection <Search size={18} />
      </button>
    </div>

    {/* Trust & Guarantees Footer Strip */}
    <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10">
      
      {/* Verified and Authenticated Rating Widget */}
      <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-extrabold text-sm tracking-tight">4.9 / 5.0</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3 text-emerald-400 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Verified &amp; Authenticated</span>
          </div>
        </div>
        <div className="pl-3 border-l border-white/15 flex flex-col items-start">
          <span className="text-white font-bold text-xs tracking-wider uppercase">Trustpilot</span>
          <span className="text-gray-400 text-[10px] font-medium">1,250+ Reviews</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {['Fully Customized', 'Instant Live 3D Mockup', 'Express Worldwide Shipping'].map((badge) => (
          <div key={badge} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--neon-pink)]/20 border border-[var(--neon-pink)]/40 text-[var(--neon-pink)] shadow-[0_0_10px_var(--neon-pink)]">
              <svg viewBox="0 0 12 12" className="w-3 h-3 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>
            <span className="text-gray-200 text-xs sm:text-sm font-semibold tracking-wide">{badge}</span>
          </div>
        ))}
      </div>

    </div>

  </div>
</section>

      {/* FEATURED DESIGNS — 4 products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] text-xs font-semibold mb-4 animate-fade-in-down">
            <Sparkles size={13} /> Bestseller Designs
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
            Our Top Neon Designs
          </h2>
          <p className="text-gray-400 mt-3 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Four handpicked favourites — loved by thousands of customers
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED_DESIGNS.map((d, i) => (
            <DesignCard key={d.id} design={d} index={i} />
          ))}
        </div>
        <div className="text-center mt-10 reveal">
          <button
            onClick={() => navigate('/more-designs')}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_-8px_var(--neon-pink)]"
            style={{ background: 'var(--neon-pink)' }}
          >
            View More Designs
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-500 text-xs mt-3">Here is More designs waiting for you..</p>
        </div>
      </section>
      <SectionDivider />


<section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 rounded-3xl animate-fade-in" style={{ background: 'linear-gradient(135deg, #3b0e6e 0%, #5c1fa0 35%, #4a1590 65%, #2d1270 100%)' }}>
  {/* Thin white gradient border lines */}
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

  {/* Ambient background glow */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--neon-pink)]/10 blur-[100px] rounded-full pointer-events-none" />

  <div className="text-center mb-12 relative z-10 animate-fade-in-down">
    <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Why Choose Us</h2>
    <p className="text-gray-300 mt-3 text-sm sm:text-base font-light">Premium quality, designed to last</p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
    {[
      { icon: PenTool, title: 'Custom Design', desc: 'Each LED neon sign or artwork is designed in-house by our professional designers.' },
      { icon: Zap, title: 'Energy & Cost Efficiency', desc: 'Low energy consumption, over 100,000 hours of usage life, no heat or noise.' },
      { icon: Recycle, title: 'Durable', desc: 'The latest neon flex technology, which is stronger and lighter than glass neon tubes.' },
      { icon: Wrench, title: 'Easy Mounting', desc: 'If you don\'t want to damage your wall, you can purchase our mounting tapes that can carry up to 50kg.' },
    ].map((f, i) => (
      <div 
        key={i} 
        className="group relative bg-[#0f0b1e]/60 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-[var(--neon-pink)]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(255,42,109,0.2)] text-center flex flex-col items-center animate-fade-in-up"
        style={{ animationDelay: `${i * 150}ms` }}
      >
        {/* Subtle inner neon border highlight glow on hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--neon-pink)]/30 transition-colors pointer-events-none" />

        {/* Icon Container with pop/pulse effect */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-purple)]/20 border border-white/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:border-[var(--neon-pink)]/50 transition-all duration-300">
          <f.icon size={26} className="text-[var(--neon-pink)] group-hover:text-white transition-colors" />
        </div>

        <h3 className="text-white font-bold text-base lg:text-lg mb-2.5 tracking-wide">{f.title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light">{f.desc}</p>
      </div>
    ))}
  </div>
</section>
      <SectionDivider />

     

      {/* TOP SELLING PRODUCTS MARQUEE */}
      <section className="py-12 bg-[#0a0a0f] border-y border-white/5 overflow-hidden">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] text-xs font-semibold mb-3 animate-fade-in-down">
            <Sparkles size={13} /> Bestsellers
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-white animate-fade-in-down" style={{ animationDelay: '0.05s' }}>Top Selling Products</h2>
        </div>
        <div className="flex animate-marquee gap-4 w-max">
          {[...MORE_DESIGNS.slice(0, 8), ...MORE_DESIGNS.slice(0, 8)].map((d, i) => (
            <div key={i} className="w-64 shrink-0">
              <div className="bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--neon-pink)]/40 transition-all hover:-translate-y-1 group">
                <div className="aspect-square overflow-hidden bg-[#0a0a0f]">
                  <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm truncate">{d.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[var(--neon-pink)] font-bold text-sm">{formatPrice(d.price)}</span>
                    <span className="text-gray-500 text-xs flex items-center gap-1"><Star size={11} className="fill-[#00b67a] text-[#00b67a]" /> 4.9</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SectionDivider />

      {/* CONTENTS OF THE BOX */}
    {/* CONTENTS OF THE BOX */}
<section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden animate-fade-in">
  {/* Thin white gradient border lines */}
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
    
    {/* Image Card with Glow & Onload Animation */}
    <div className="relative rounded-3xl overflow-hidden border border-white/10 group shadow-2xl bg-white/5 backdrop-blur-md animate-fade-in-left">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon-pink)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <img
        src="logo.png"
        alt="Contents of the Box"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </div>

    {/* Content List with Onload Animation */}
    <div className="animate-fade-in-right">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Contents of the Box</h2>
      <p className="text-gray-300 mt-4 leading-relaxed font-light">
        Every Neon Lab by Yash sign comes with everything you need for a seamless installation. Your box includes:
      </p>
      
      <ul className="space-y-3.5 mt-6">
        {[
          'Your custom LED neon sign',
          '12V power adaptor with 2m cable',
          'Wall mounting screws and anchors',
          'Remote dimmer (if selected)',
          'Care and installation guide',
        ].map((item, i) => (
          <li 
            key={i} 
            className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--neon-pink)]/40 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--neon-pink)]/20 border border-[var(--neon-pink)]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="text-[var(--neon-pink)] text-xs font-bold">{i + 1}</span>
            </div>
            <span className="text-gray-200 text-sm font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>

  </div>
</section>

<SectionDivider />
<br /><br />

{/* NEWSLETTER */}
<section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
  <div className="relative rounded-3xl overflow-hidden border border-white/15 p-10 lg:p-16 text-center bg-gradient-to-br from-[#1a0a2e]/90 to-[#0a1a2e]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(255,42,109,0.15)]">
    
    {/* Thin white gradient border lines */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

    {/* Ambient Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ background: 'var(--neon-pink)' }} />
    
    <div className="relative z-10">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
        Sign up now & get <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">£10 off</span>
      </h2>
      <p className="text-gray-300 mt-3 max-w-xl mx-auto font-light text-sm sm:text-base">
        Be the first to get the latest news about trends, promotions, and much more!
      </p>

      <form onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append('_subject', 'Newsletter Signup — Neon Lab by Yash');
        try {
          await fetch('https://formspree.io/f/mjgnbpve', { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
          form.reset();
          alert('Thanks for subscribing! You\'ll receive your £10 off code shortly.');
        } catch {
          alert('Something went wrong. Please try again.');
        }
      }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--neon-pink)] focus:ring-1 focus:ring-[var(--neon-pink)] transition-all text-sm"
        />
        <button 
          type="submit" 
          className="bg-[var(--neon-pink)] text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-95 shadow-lg shadow-[var(--neon-pink)]/25 hover:shadow-[var(--neon-pink)]/40 transition-all text-sm cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  </div>
</section>

    </div>
  );
}
