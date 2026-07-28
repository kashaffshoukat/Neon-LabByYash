import { useState, useEffect } from 'react';
import { useCart } from '../cart';
import { formatPrice, DELIVERY_CHARGE, TAX_PER_ITEM } from '../lib';
import { navigate, useRoute } from '../router';
import { ArrowLeft, Lock, CreditCard, Loader2, Mail, Phone, MapPin, Truck, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [successData, setSuccessData] = useState<{ orderId: string; amount: number; email: string } | null>(null);

  // Handle Stripe redirect success
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (params.get('status') === 'success') {
      const sessionId = params.get('session_id') || 'N/A';
      setSuccessData({ orderId: sessionId, amount: total, email: email });
      clear();
    }
  }, []);

  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);
  const delivery = items.length > 0 ? DELIVERY_CHARGE * items.length : 0;
  const tax = totalUnits * TAX_PER_ITEM;
  const grandTotal = total + delivery + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms and Conditions to continue.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            customer: { name: `${firstName} ${lastName}`, phone },
            items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, variant: i.variant })),
            total: grandTotal,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Checkout session failed');
      }
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success alert — centered modal
  if (successData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4">
        <div className="relative bg-[#12121a] rounded-3xl border border-white/20 p-8 lg:p-10 max-w-lg w-full text-center shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)]" />
          <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-green-400 shadow-lg shadow-green-500/10">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Order Confirmed!</h2>
          <p className="text-gray-300 text-sm lg:text-base mb-6 leading-relaxed">
            Thank you for shopping with us. A detailed receipt and confirmation have been emailed to{' '}
            <span className="text-white font-semibold">{successData.email || email || 'your email'}</span>.
          </p>

          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/10 text-left space-y-3 mb-8 shadow-inner">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order Session ID</span>
              <span className="text-white font-mono text-xs bg-white/5 px-2 py-0.5 rounded">{successData.orderId.slice(0, 24)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Paid</span>
              <span className="text-[var(--neon-pink)] font-extrabold">{formatPrice(successData.amount || grandTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Secure Gateway</span>
              <span className="text-white flex items-center gap-1.5"><CreditCard size={14} className="text-gray-400" /> Stripe</span>
            </div>
          </div>

          <button
            onClick={() => { setSuccessData(null); navigate('/'); }}
            className="w-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--neon-pink)]/30 cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 text-lg mb-4">Your cart is currently empty.</p>
        <button onClick={() => navigate('/more-designs')} className="text-[var(--neon-pink)] font-semibold hover:underline cursor-pointer">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* RGB ambient glow decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'var(--neon-pink)', opacity: 0.08 }} />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[100px]" style={{ background: 'var(--neon-blue)', opacity: 0.06 }} />
      </div>

      <div className="relative z-10">
        <button onClick={() => navigate('/cart')} className="group inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </button>

        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-semibold mb-2">
            <Lock size={12} /> Secure Checkout
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">Order</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-6">
            {/* Contact Info */}
            <div className="bg-white/[0.04] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 flex items-center justify-center text-[var(--neon-pink)]">
                  <Mail size={16} />
                </span>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address (for order tracking & receipt)</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number (for courier delivery updates)</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7000 000000" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white/[0.04] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 flex items-center justify-center text-[var(--neon-pink)]">
                  <MapPin size={16} />
                </span>
                Shipping Address
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Yash" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Patel" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Street Address</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Neon Avenue, Suite 4B" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Postcode / Zip Code</label>
                  <input type="text" required value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SW1A 1AA" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm cursor-pointer">
                    <option value="United Kingdom" className="bg-[#12121a]">United Kingdom</option>
                    <option value="United States" className="bg-[#12121a]">United States</option>
                    <option value="Australia" className="bg-[#12121a]">Australia</option>
                    <option value="Canada" className="bg-[#12121a]">Canada</option>
                    <option value="Ireland" className="bg-[#12121a]">Ireland</option>
                    <option value="Germany" className="bg-[#12121a]">Germany</option>
                    <option value="France" className="bg-[#12121a]">France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white/[0.04] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 flex items-center justify-center text-[var(--neon-pink)]">
                  <CreditCard size={16} />
                </span>
                Payment Method
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Name on Card</label>
                  <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Yash Patel" className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-all text-sm" />
                </div>
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-gray-300 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Lock size={18} />
                  </div>
                  <p className="text-xs leading-relaxed text-gray-300">
                    You will be securely redirected to <strong className="text-white">Stripe</strong> to complete your payment with credit card, Apple Pay, or Google Pay.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-green-400 font-medium">
                <ShieldCheck size={15} /> 256-Bit SSL Bank-Grade Encryption via Stripe
              </div>
            </div>

            {/* T&C checkbox */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setError(null); }}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--neon-pink)] cursor-pointer"
                />
                <span className="text-gray-300 text-xs leading-relaxed">
                  I have read and agree to the{' '}
                  <button type="button" onClick={() => navigate('/terms-of-service')} className="text-[var(--neon-pink)] font-medium hover:underline">Terms of Service</button>,{' '}
                  <button type="button" onClick={() => navigate('/privacy-policy')} className="text-[var(--neon-pink)] font-medium hover:underline">Privacy Policy</button>, and{' '}
                  <button type="button" onClick={() => navigate('/refund-policy')} className="text-[var(--neon-pink)] font-medium hover:underline">Refund Policy</button>.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm flex items-center gap-2.5">
                <ShieldAlert size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer text-base"
            >
              {loading ? <><Loader2 size={20} className="animate-spin" /> Redirecting to Stripe...</> : <><Lock size={18} /> Pay Securely {formatPrice(grandTotal)}</>}
            </button>
          </form>

          {/* Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-white/[0.04] rounded-3xl p-6 lg:p-8 border border-white/10 h-fit lg:sticky lg:top-24 shadow-2xl backdrop-blur-md">
            <h2 className="text-white font-extrabold text-lg mb-5 pb-4 border-b border-white/10 flex items-center justify-between">
              <span>Order Items</span>
              <span className="text-xs font-normal text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">{totalUnits} units</span>
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3.5 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                      <span className="text-xs font-bold text-gray-400">Custom</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    {item.variant && <p className="text-gray-400 text-xs truncate mt-0.5">{item.variant}</p>}
                    <p className="text-gray-400 text-xs mt-0.5">Quantity: <span className="text-white font-medium">{item.quantity}</span></p>
                  </div>
                  <span className="text-white text-sm font-bold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-5 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-medium text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Charge</span>
                <span className="font-medium text-white">{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>VAT / Tax</span>
                <span className="font-medium text-white">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-xl pt-4 border-t border-white/15">
                <span>Grand Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                <Truck size={15} className="text-[var(--neon-pink)]" />
                <span>Fast Transit</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs border-x border-white/10 px-1">
                <ShieldCheck size={15} className="text-[var(--neon-pink)]" />
                <span>Buyer Protection</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                <Lock size={15} className="text-[var(--neon-pink)]" />
                <span>Stripe Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}