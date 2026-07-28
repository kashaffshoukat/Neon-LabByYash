import { Heart, ShoppingBag, Menu, X, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { navigate, useRoute } from '../router';
import { useCart, useWishlist } from '../cart';
import { formatPrice } from '../lib';

const NAV = [
  { label: 'Back to Home', path: '/' },
  { label: 'Customiser', path: '/customiser' },
  { label: 'Browse Collection', path: '/more-designs' },
  { label: 'Upload Your Own Design', path: '/logo-upload' },
  { label: 'What People Say', path: '/reviews' },
  { label: 'FAQs', path: '/faq' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const route = useRoute();
  const { count, setOpen } = useCart();
  const wishlist = useWishlist();

  const isActive = (path: string) => {
    if (path === '/') return route.name === 'home';
    if (path === '/customiser') return route.name === 'customiser';
    if (path === '/more-designs') return route.name === 'more-designs';
    if (path === '/logo-upload') return route.name === 'logo-upload';
    if (path === '/reviews') return route.name === 'reviews';
    if (path === '/faq') return route.name === 'faq';
    return false;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wishlistRef.current && !wishlistRef.current.contains(e.target as Node)) {
        setWishlistOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile nav open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button className="lg:hidden text-white p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <a href="#/" className="flex items-center select-none" aria-label="Neon Lab by Yash home">
            <img src="/logo.jpeg" alt="Neon Lab by Yash" className="h-12 lg:h-14 w-auto object-contain" />
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--neon-pink)] ${
                  isActive(item.path) ? 'text-[var(--neon-pink)]' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="relative" ref={wishlistRef}>
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative text-gray-300 hover:text-white transition-colors p-2"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlist.count > 0 && (
                  <span className="absolute top-1 right-1 bg-[var(--neon-pink)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-count-pop">
                    {wishlist.count}
                  </span>
                )}
              </button>

              {wishlistOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 max-w-[calc(100vw-2rem)] bg-[#12121a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in-down">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold text-sm">Wishlist ({wishlist.count})</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {wishlist.items.length === 0 ? (
                      <p className="text-gray-500 text-sm p-6 text-center">Your wishlist is empty</p>
                    ) : (
                      wishlist.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Heart size={18} className="text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{item.name}</p>
                            {item.variant && <p className="text-gray-500 text-[10px] truncate">{item.variant}</p>}
                            <p className="text-[var(--neon-pink)] text-xs font-semibold mt-0.5">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => wishlist.remove(item.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors shrink-0 p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {wishlist.items.length > 0 && (
                    <div className="p-3 border-t border-white/10">
                      <button
                        onClick={() => { setWishlistOpen(false); navigate('/more-designs'); }}
                        className="w-full text-center text-sm text-[var(--neon-pink)] hover:underline py-1"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="relative text-gray-300 hover:text-white transition-colors p-2"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-[var(--neon-pink)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-count-pop">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer Fix */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] h-[100dvh] w-screen overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          
          {/* Drawer Panel taking full height */}
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#0e0e15] border-r border-white/10 flex flex-col shadow-2xl z-10">
            <div className="gradient-line" style={{ top: 0 }} />
            
            {/* Header inside drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <img src="/logo.jpeg" alt="Neon Lab by Yash" className="h-11 w-auto object-contain" />
              <button 
                onClick={() => setMobileOpen(false)} 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors" 
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
              {NAV.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full text-left px-5 py-4 rounded-xl font-medium text-base transition-all flex items-center justify-between ${
                    isActive(item.path)
                      ? 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border border-[var(--neon-pink)]/30 shadow-lg'
                      : 'text-gray-200 hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-xs opacity-40 ${isActive(item.path) ? 'text-[var(--neon-pink)] opacity-100' : ''}`}>→</span>
                </button>
              ))}
            </nav>

            {/* Quick actions footer */}
            <div className="border-t border-white/10 p-5 space-y-4 bg-black/40 shrink-0">
              <button
                onClick={() => { setMobileOpen(false); navigate('/customiser'); }}
                className="w-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg hover:opacity-95 transition-opacity"
              >
                Design Your Own Sign
              </button>
              <div className="flex items-center justify-around pt-2">
                <button onClick={() => { setMobileOpen(false); navigate('/reviews'); }} className="text-gray-400 text-xs hover:text-white transition-colors py-1">Reviews</button>
                <span className="text-white/20">•</span>
                <button onClick={() => { setMobileOpen(false); navigate('/faq'); }} className="text-gray-400 text-xs hover:text-white transition-colors py-1">FAQ</button>
                <span className="text-white/20">•</span>
                <a href="tel:+447301288315" className="text-gray-400 text-xs hover:text-white transition-colors py-1">Contact</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function AnnouncementBar() {
  const messages = [
    'Instant Live 3D Mockup of Your Design', 
    'Fully Customized Neon Signs for Your Space', 
    'Design Your Own Custom Neon Today',
   
  ];
  return (
    <div className="bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)] overflow-hidden relative">
      <div className="rgb-gradient-line rgb-gradient-line-bottom" />
      <div 
        className="flex whitespace-nowrap py-2 animate-marquee-responsive"
        style={{
          // Faster duration on mobile screens, slower on desktop to keep visual speed balanced
          animation: 'marquee 10s linear infinite',
        }}
      >
        {[...messages, ...messages, ...messages, ...messages].map((m, i) => (
          <span key={i} className="text-sm font-semibold text-white px-8">
            {m} <span className="mx-2 opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}