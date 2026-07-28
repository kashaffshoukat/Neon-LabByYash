import { useEffect, useState } from 'react';
import { formatPrice, PRODUCT_SIZES, COLOR_VARIATION_NOTE, NEON_COLORS } from '../lib';
import { useCart, useWishlist } from '../cart';
import { FEATURED_DESIGNS, MORE_DESIGNS, type Design } from '../designs';
import { navigate } from '../router';
import { StarRating } from '../components/StarRating';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, Award, Heart, Check, Info, ChevronRight, Ruler, Palette, Zap, RotateCcw, Package } from 'lucide-react';
import { useReveal } from '../useReveal';

const ALL_DESIGNS: Design[] = [...FEATURED_DESIGNS, ...MORE_DESIGNS];

export function DesignPage({ id }: { id: string }) {
  useReveal();
  const design = ALL_DESIGNS.find((d) => d.id === id);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<(typeof PRODUCT_SIZES)[number]>(PRODUCT_SIZES[0]);
  const [selectedColor, setSelectedColor] = useState<(typeof NEON_COLORS)[number]>(NEON_COLORS[0]);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(PRODUCT_SIZES[0]);
    setSelectedColor(NEON_COLORS[0]);
  }, [id]);

  const handleAddToCart = () => {
    if (!design) return;
    add({
      id: design.id,
      name: design.title,
      price: selectedSize.price,
      image_url: design.image,
      quantity: qty,
      variant: `Size: ${selectedSize.label} (${selectedSize.heightCm}×${selectedSize.widthCm}cm) · Color: ${selectedColor.name}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (!design) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center section-animate">
        <p className="text-gray-400 text-lg">Design not found.</p>
        <button onClick={() => navigate('/more-designs')} className="text-[var(--neon-pink)] mt-4 hover:underline">Back to Designs</button>
      </div>
    );
  }

  const isWishlisted = wishlist.has(design.id);
  const effectiveColor = selectedColor;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 animate-fade-in">
        <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight size={12} />
        <button onClick={() => navigate('/more-designs')} className="hover:text-white transition-colors">Designs</button>
        <ChevronRight size={12} />
        <span className="text-gray-300">{design.title}</span>
      </nav>

      <button
        onClick={() => navigate('/more-designs')}
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors animate-fade-in"
      >
        <ArrowLeft size={16} /> Back to Designs
      </button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="section-animate">
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative gradient-border-wrap">
            <div className="rgb-gradient-line rgb-gradient-line-top" />
            <img src={design.image} alt={design.title} className="w-full h-full object-cover" style={{ filter: `drop-shadow(0 0 24px ${effectiveColor.hex}55)` }} />
          </div>
          <p className="text-gray-500 text-xs mt-3 text-center">{COLOR_VARIATION_NOTE}</p>
        </div>

        {/* Details */}
        <div className="section-animate" style={{ animationDelay: '0.1s' }}>
          {design.badge && (
            <span className="inline-block bg-[var(--neon-pink)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{design.badge}</span>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-white animate-fade-in-down">{design.title}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={5} />
            <span className="text-gray-400 text-sm">5.0 (Top rated design)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-[var(--neon-pink)]">{formatPrice(selectedSize.price)}</span>
            <span className="text-gray-500 text-lg line-through">{formatPrice(selectedSize.price + 15000)}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Price varies by size selected below</p>

          <p className="text-gray-400 mt-5 leading-relaxed">{design.description}</p>

          {/* Size selector */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Ruler size={16} className="text-[var(--neon-pink)]" />
              <label className="text-white font-semibold text-sm">Choose Size & Dimensions</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRODUCT_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s)}
                  className={`rounded-xl border py-3 px-3 text-left transition-all ${
                    selectedSize.id === s.id ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                  }`}
                >
                  <span className="block text-white font-semibold text-sm">{s.label}</span>
                  <span className="block text-gray-400 text-[10px] mt-0.5">{s.heightCm}cm(h) × {s.widthCm}cm(w)</span>
                  <span className="block text-[var(--neon-pink)] text-xs mt-1">{formatPrice(s.price)}</span>
                  {s.split && <span className="block text-yellow-500/80 text-[9px] mt-0.5">*Split pieces</span>}
                </button>
              ))}
            </div>
            {selectedSize.split && (
              <div className="mt-2 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <Info size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-yellow-500/90 text-xs leading-relaxed">This size is split into multiple pieces. Contact us for details on how the pieces are arranged.</p>
              </div>
            )}
          </div>

          {/* Color selector */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={16} className="text-[var(--neon-pink)]" />
              <label className="text-white font-semibold text-sm">Choose Neon Color</label>
              <span className="text-gray-400 text-xs ml-auto">{effectiveColor.name}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {NEON_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    effectiveColor.name === c.name ? 'border-white scale-110' : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ background: c.hex, boxShadow: effectiveColor.name === c.name ? `0 0 12px ${c.hex}` : 'none' }}
                  aria-label={c.name}
                >
                  {effectiveColor.name === c.name && <Check size={14} className="text-black/70" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to cart + Wishlist */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-white/15 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-gray-300 hover:text-white">−</button>
              <span className="text-white px-4">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-gray-300 hover:text-white">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[var(--neon-pink)] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
            </button>
            <button
              onClick={() => wishlist.toggle({ id: design.id, name: design.title, price: selectedSize.price, image_url: design.image, quantity: 1 })}
              className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                isWishlisted ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]' : 'border-white/15 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Color variation disclaimer */}
          <div className="mt-5 flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-3.5">
            <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs leading-relaxed">{COLOR_VARIATION_NOTE}</p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            {[
              { icon: Truck, label: '£19.90 Flat Delivery' },
              { icon: ShieldCheck, label: '24 Month Warranty' },
              { icon: Award, label: 'Premium LED Quality' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <f.icon size={24} className="text-[var(--neon-pink)] mx-auto mb-2" />
                <p className="text-gray-400 text-xs">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size guide table */}
      <div className="mt-16 section-animate">
        <div className="flex items-center gap-2 mb-6">
          <Ruler size={22} className="text-[var(--neon-pink)]" />
          <h2 className="text-2xl font-bold text-white">Size Guide & Pricing</h2>
        </div>
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden gradient-border-wrap">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-3 text-gray-400 font-semibold">Size</th>
                  <th className="px-5 py-3 text-gray-400 font-semibold">Dimensions (H × W)</th>
                  <th className="px-5 py-3 text-gray-400 font-semibold">Inches</th>
                  <th className="px-5 py-3 text-gray-400 font-semibold">Price</th>
                  <th className="px-5 py-3 text-gray-400 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_SIZES.map((s) => (
                  <tr key={s.id} className={`border-b border-white/5 ${selectedSize.id === s.id ? 'bg-[var(--neon-pink)]/5' : ''}`}>
                    <td className="px-5 py-3 text-white font-medium">{s.label}</td>
                    <td className="px-5 py-3 text-gray-400">{s.heightCm}cm × {s.widthCm}cm</td>
                    <td className="px-5 py-3 text-gray-400">{(s.heightCm / 2.54).toFixed(1)}" × {(s.widthCm / 2.54).toFixed(1)}"</td>
                    <td className="px-5 py-3 text-[var(--neon-pink)] font-semibold">{formatPrice(s.price)}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{s.split ? '*Split in multiple pieces' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">* Sizes 150cm, 200cm and 250cm are split in multiple pieces. Ask for details.</p>
      </div>

      {/* Full specifications */}
      <div className="mt-16 section-animate">
        <div className="flex items-center gap-2 mb-6">
          <Package size={22} className="text-[var(--neon-pink)]" />
          <h2 className="text-2xl font-bold text-white">Full Specifications</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <SpecCard icon={Ruler} title="Dimensions" rows={[
            ['Height', `${selectedSize.heightCm} cm (${(selectedSize.heightCm / 2.54).toFixed(1)} in)`],
            ['Width', `${selectedSize.widthCm} cm (${(selectedSize.widthCm / 2.54).toFixed(1)} in)`],
            ['Selected Size', selectedSize.label],
            ['Pieces', selectedSize.split ? 'Multiple (split)' : 'Single piece'],
          ]} />
          <SpecCard icon={Palette} title="Colors Available" rows={[
            ['Selected Color', effectiveColor.name],
            ['Color Code', effectiveColor.hex.toUpperCase()],
            ['Available Colors', NEON_COLORS.map((c) => c.name).join(', ')],
            ['Note', 'Custom colors available on request'],
          ]} />
          <SpecCard icon={Zap} title="Power & Technical" rows={[
            ['Power Source', '12V Low Voltage Adaptor'],
            ['Power Plug', 'UK / EU / US available'],
            ['LED Lifespan', '50,000+ hours'],
            ['Energy Use', 'Energy efficient'],
          ]} />
          <SpecCard icon={Package} title="Materials & Build" rows={[
            ['LED Type', 'Premium Flexible Silicone Neon'],
            ['Backboard', 'Clear / White / Black acrylic'],
            ['Mounting', 'Screws included (remote & hanging optional)'],
            ['Indoor/Outdoor', 'Indoor standard (outdoor box optional)'],
          ]} />
        </div>
      </div>

      {/* What's in the box */}
      <div className="mt-16 section-animate">
        <div className="flex items-center gap-2 mb-6">
          <Package size={22} className="text-[var(--neon-pink)]" />
          <h2 className="text-2xl font-bold text-white">What's in the Box</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Your custom neon sign', '12V power adaptor (UK plug)', 'Wall mounting screws & caps', 'Remote dimmer (optional extra)'].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <Check size={18} className="text-[var(--neon-pink)] shrink-0" />
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & returns */}
      <div className="mt-16 section-animate">
        <div className="flex items-center gap-2 mb-6">
          <Truck size={22} className="text-[var(--neon-pink)]" />
          <h2 className="text-2xl font-bold text-white">Shipping & Returns</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <InfoTile icon={Truck} title="Delivery" body="Flat £19.90 delivery per product. Free UK delivery on orders over £75. Production takes 7–10 working days." />
          <InfoTile icon={ShieldCheck} title="Warranty" body="Every sign comes with a 24-month warranty covering manufacturing defects." />
          <InfoTile icon={RotateCcw} title="Returns" body="Due to the custom nature of neon signs, returns are accepted only for damaged or defective items. Contact us within 14 days." />
        </div>
      </div>

      {/* You may also like */}
      <div className="mt-16 section-animate">
        <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_DESIGNS.filter((d) => d.id !== design.id).slice(0, 4).map((d) => (
            <button key={d.id} onClick={() => navigate(`/designs/${d.id}`)} className="group text-left bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all hover:-translate-y-1">
              <div className="aspect-square overflow-hidden bg-white/5">
                <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate">{d.title}</h3>
                <p className="text-[var(--neon-pink)] font-bold text-sm mt-1">{formatPrice(d.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon: Icon, title, rows }: { icon: typeof Ruler; title: string; rows: [string, string][] }) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 gradient-border-wrap">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-[var(--neon-pink)]" />
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
      <dl className="space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 text-sm">
            <dt className="text-gray-500 shrink-0">{k}</dt>
            <dd className="text-gray-200 text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function InfoTile({ icon: Icon, title, body }: { icon: typeof Truck; title: string; body: string }) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
      <Icon size={20} className="text-[var(--neon-pink)] mb-3" />
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{body}</p>
    </div>
  );
}
