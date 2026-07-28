import { useCart } from '../cart';
import { formatPrice, DELIVERY_CHARGE, TAX_PER_ITEM } from '../lib';
import { navigate } from '../router';
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Plus, Minus, Lock, Truck, ShieldCheck, Sparkles, CreditCard, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export function CartPage() {
  const { items, remove, updateQty, total, clear } = useCart();
  const [agreed, setAgreed] = useState(false);

  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);
  const delivery = items.length > 0 ? DELIVERY_CHARGE * items.length : 0;
  const tax = totalUnits * TAX_PER_ITEM;
  const grandTotal = total + delivery + tax;

  if (items.length === 0) {
    return (
      <div className="relative max-w-2xl mx-auto px-4 py-24 text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ background: 'var(--neon-pink)', opacity: 0.08 }} />
        <div className="relative z-10 bg-white/[0.02] border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 flex items-center justify-center mx-auto mb-5 text-[var(--neon-pink)]">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Your Cart is Empty</h1>
          <p className="text-gray-400 text-sm lg:text-base mb-8 max-w-md mx-auto leading-relaxed">Your neon universe is waiting to be lit. Explore our collection or design a bespoke custom sign today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/custom')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--neon-pink)]/30"
            >
              <Sparkles size={18} /> Custom Creator
            </button>
            <button
              onClick={() => navigate('/more-designs')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
            >
              Browse Products <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Ambient RGB blobs for background depth */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'var(--neon-pink)', opacity: 0.05 }} />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[100px]" style={{ background: 'var(--neon-blue)', opacity: 0.04 }} />
      </div>

      <div className="relative z-10">
        <button onClick={() => navigate('/')} className="group inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-semibold mb-2">
              <ShoppingBag size={12} /> Secure Order
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white">Review Your Cart</h1>
          </div>
          <span className="text-gray-400 text-sm">
            {totalUnits} {totalUnits === 1 ? 'item' : 'items'} selected
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/10 shadow-inner" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} className="text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-base truncate">{item.name}</h3>
                      {item.variant && <p className="text-gray-400 text-xs mt-0.5 truncate bg-white/5 px-2 py-0.5 rounded w-fit">{item.variant}</p>}
                      <p className="text-[var(--neon-pink)] font-extrabold text-base mt-1.5">{formatPrice(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="flex items-center bg-white/5 border border-white/15 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-semibold text-sm px-3">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-white font-bold text-base lg:text-lg">{formatPrice(item.price * item.quantity)}</span>
                    </div>

                    <button onClick={() => remove(item.id)} className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer" title="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  onClick={clear}
                  className="text-gray-400 text-xs hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} /> Clear Shopping Cart
                </button>
                <span className="text-xs text-gray-500">Prices inclusive of quality checks</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white/[0.04] rounded-3xl p-6 lg:p-8 border border-white/10 h-fit lg:sticky lg:top-24 shadow-2xl backdrop-blur-md">
            <h2 className="text-white font-extrabold text-xl mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">{totalUnits} units</span>
            </h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span className="font-medium text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-medium text-white">{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>VAT / Tax</span>
                <span className="font-medium text-white">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-white font-extrabold text-xl pt-4 border-t border-white/15 mb-6">
              <span>Total Amount</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">{formatPrice(grandTotal)}</span>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--neon-pink)] cursor-pointer"
                />
                <span className="text-gray-300 text-xs leading-relaxed">
                  I agree to the{' '}
                  <button onClick={() => navigate('/terms-of-service')} className="text-[var(--neon-pink)] font-medium hover:underline">Terms of Service</button>{' '}
                  and{' '}
                  <button onClick={() => navigate('/privacy-policy')} className="text-[var(--neon-pink)] font-medium hover:underline">Privacy Policy</button>.
                </span>
              </label>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={!agreed}
              className="w-full bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              Proceed to Secure Checkout <ArrowRight size={18} />
            </button>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                <Lock size={15} className="text-[var(--neon-pink)]" />
                <span>Secure SSL</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs border-x border-white/10 px-1">
                <Truck size={15} className="text-[var(--neon-pink)]" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                <ShieldCheck size={15} className="text-[var(--neon-pink)]" />
                <span>24m Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}