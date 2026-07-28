import { useEffect, useState } from 'react';
import { supabase, formatPrice, PRODUCT_SIZES, COLOR_VARIATION_NOTE, NEON_COLORS } from '../lib';
import { useCart, useWishlist } from '../cart';
import type { Product, Review } from '../types';
import { navigate } from '../router';
import { StarRating } from '../components/StarRating';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, Award, BadgeCheck, ThumbsUp, Heart, Check, Info, ChevronRight, Ruler, Palette, Zap, RotateCcw, Package } from 'lucide-react';
import { useReveal } from '../useReveal';

export function ProductPage({ slug }: { slug: string }) {
  useReveal();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<(typeof PRODUCT_SIZES)[number]>(PRODUCT_SIZES[0]);
  const [selectedColor, setSelectedColor] = useState<(typeof NEON_COLORS)[number]>(NEON_COLORS[0]);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: prod } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
      setProduct(prod);
      if (prod) {
        const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', prod.id).order('created_at', { ascending: false }).limit(5);
        setReviews(revs ?? []);
      }
      setActiveImage(0);
      setSelectedSize(PRODUCT_SIZES[0]);
      setSelectedColor(NEON_COLORS[0]);
      setLoading(false);
    })();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    add({
      id: product.id,
      name: product.name,
      price: selectedSize.price,
      image_url: product.image_url,
      quantity: qty,
      variant: `Size: ${selectedSize.label} (${selectedSize.heightCm}×${selectedSize.widthCm}cm) · Color: ${selectedColor.name}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-white/5 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center section-animate">
        <p className="text-gray-400 text-lg">Product not found.</p>
        <button onClick={() => navigate('/collections')} className="text-[var(--neon-pink)] mt-4 hover:underline">Back to Collections</button>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image_url].filter(Boolean) as string[];
  const isWishlisted = wishlist.has(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 animate-fade-in">
        <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight size={12} />
        <button onClick={() => navigate('/more-designs')} className="hover:text-white transition-colors">Designs</button>
        <ChevronRight size={12} />
        <span className="text-gray-300">{product.name}</span>
      </nav>

      {/* Back button */}
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
            {gallery[activeImage] && <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover" />}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[var(--neon-pink)]' : 'border-white/10'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="section-animate" style={{ animationDelay: '0.1s' }}>
          {product.badge && (
            <span className="inline-block bg-[var(--neon-pink)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{product.badge}</span>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-white animate-fade-in-down">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.rating} />
            <span className="text-gray-400 text-sm">{product.rating.toFixed(1)} ({reviews.length} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-[var(--neon-pink)]">{formatPrice(selectedSize.price)}</span>
            {product.compare_at_price && <span className="text-gray-500 text-lg line-through">{formatPrice(product.compare_at_price)}</span>}
          </div>
          <p className="text-gray-500 text-xs mt-1">Price varies by size selected below</p>

          {product.description && <p className="text-gray-400 mt-5 leading-relaxed">{product.description}</p>}

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
                <p className="text-yellow-500/90 text-xs leading-relaxed">
                  This size is split into multiple pieces. Contact us for details on how the pieces are arranged.
                </p>
              </div>
            )}
          </div>

          {/* Color selector */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={16} className="text-[var(--neon-pink)]" />
              <label className="text-white font-semibold text-sm">Choose Neon Color</label>
              <span className="text-gray-400 text-xs ml-auto">{selectedColor.name}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {NEON_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor.name === c.name ? 'border-white scale-110' : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ background: c.hex, boxShadow: selectedColor.name === c.name ? `0 0 12px ${c.hex}` : 'none' }}
                  aria-label={c.name}
                >
                  {selectedColor.name === c.name && <Check size={14} className="text-black/70" />}
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
              disabled={!product.in_stock}
              className="flex-1 bg-[var(--neon-pink)] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> {product.in_stock ? 'Add to Cart' : 'Sold Out'}</>}
            </button>
            <button
              onClick={() => wishlist.toggle({ id: product.id, name: product.name, price: selectedSize.price, image_url: product.image_url, quantity: 1 })}
              className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]'
                  : 'border-white/15 text-gray-400 hover:border-white/30 hover:text-white'
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
            ['Selected Color', selectedColor.name],
            ['Color Code', selectedColor.hex.toUpperCase()],
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
          {[
            'Your custom neon sign',
            '12V power adaptor (UK plug)',
            'Wall mounting screws & caps',
            'Remote dimmer (optional extra)',
          ].map((item, i) => (
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

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-16 section-animate">
          <div className="flex items-center gap-2 mb-6">
            <BadgeCheck size={22} className="text-[var(--neon-pink)]" />
            <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => {
              const gradient = r.avatar_color ?? 'from-pink-500 to-rose-500';
              return (
                <div key={r.id} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {r.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-white font-semibold text-sm">{r.author}</p>
                        {r.verified !== false && (
                          <span className="inline-flex items-center gap-0.5 text-[#1a73e8] text-xs font-medium">
                            <BadgeCheck size={13} /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-500 text-xs">{r.location}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs">{r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  {r.title && <p className="text-white font-semibold text-sm mb-1">{r.title}</p>}
                  <p className="text-gray-400 text-sm leading-relaxed">{r.body}</p>
                  {r.helpful_count != null && r.helpful_count > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-gray-500 text-xs">
                      <ThumbsUp size={13} /> {r.helpful_count} found this helpful
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
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
