import { useState, useEffect, useRef } from 'react';
import { X, Mail, Gift, Check, Sparkles, Loader2 } from 'lucide-react';
import { FORMSPREE_ENDPOINT } from '../lib';

const STORAGE_KEY = 'neon-subscribe-seen';

export function SubscribeModal() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* ignore */ }
    if (seen) return;
    // Show after 4s so the cookie banner (1.5s) appears first
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('_subject', 'Subscribe for Discount — Neon Lab by Yash');
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Submission failed');
      setSuccess(true);
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-modal-bg">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={dismiss} />

      <div
        ref={modalRef}
        className="relative bg-[#12121a] rounded-3xl overflow-hidden border border-white/15 shadow-2xl w-full max-w-3xl animate-modal-in"
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="rgb-gradient-line rgb-gradient-line-top" />

        <div className="grid sm:grid-cols-2">
          {/* LEFT: Image */}
          <div className="relative hidden sm:block min-h-[320px]">
            <img
              src="/logo.jpeg"
              alt="Neon sign discount"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/90 text-white text-xs font-bold mb-3">
                <Gift size={13} /> EXCLUSIVE OFFER
              </div>
              <h3 className="text-white text-2xl font-bold leading-tight">
                Get <span style={{ color: 'var(--neon-pink)' }}>10% Off</span><br />Your First Order
              </h3>
            </div>
          </div>

          {/* RIGHT: Form / Success */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {success ? (
              <div className="text-center animate-success-burst">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                  <Check size={32} className="text-green-400" />
                </div>
                <h3 className="text-white text-2xl font-bold">You're In!</h3>
                <p className="text-gray-400 mt-3 leading-relaxed text-sm">
                  Thanks for subscribing! Your discount code is on its way to your inbox.
                </p>
                <button
                  onClick={dismiss}
                  className="mt-6 bg-[var(--neon-pink)] text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] text-xs font-semibold w-fit mb-4">
                  <Sparkles size={13} /> Join the Neon Club
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight">Subscribe & Save</h3>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                  Sign up to get exclusive discounts, early access to new designs, and 10% off your first order.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Subscribing...</>
                    ) : (
                      <>Get My 10% Off <Gift size={16} /></>
                    )}
                  </button>
                </form>

                <button
                  onClick={dismiss}
                  className="mt-4 text-gray-500 text-xs hover:text-gray-400 transition-colors text-center w-full"
                >
                  No thanks, I'll pay full price
                </button>
              </>
            )}
          </div>
        </div>
        <div className="rgb-gradient-line rgb-gradient-line-bottom" />
      </div>
    </div>
  );
}
