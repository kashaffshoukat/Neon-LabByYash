import { useState, useRef, useEffect, useCallback } from 'react';
import { SectionDivider } from '../components/SectionDivider';
import {
  CUSTOMISER_FONTS,
  CUSTOMISER_SIZES,
  CUSTOMISER_MOUNTING,
  CUSTOMISER_EXTRAS,
  BACKBOARD_TYPES,
  BACKBOARD_COLOURS,
  PRODUCTION_SPEEDS,
  NEON_COLORS,
  formatPrice,
} from '../lib';
import { useCart } from '../cart';
import { navigate } from '../router';
import {
  ShoppingBag,
  Check,
  ChevronDown,
  Truck,
  ShieldCheck,
  Award,
  PenTool,
  Zap,
  Recycle,
  Wrench,
  Info,
  Share2,
  Plus,
  Minus,
  Calendar,
  Palette,
} from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { COLOR_VARIATION_NOTE } from '../lib';

const FAQ_ITEMS = [
  { q: 'What is included with the product?', a: 'As standard your sign comes with a 12v plug and wall mounting screws. Other accessories can be added such as a dimmer.' },
  { q: 'What are your neon signs made from?', a: 'The "neon" light is made using Ultra Glow LED technology, giving the most realistic neon glow, night or day! The main structure is made from clear acrylic — highly durable and the clear finish blends into the wall behind.' },
  { q: 'How bright are Neu Neon neon signs?', a: 'Bright enough to fill your room with a neon glow. The optional Remote dimmer is highly recommended — easily increase or decrease brightness depending on your mood.' },
  { q: 'Does my sign come with a remote dimmer as standard?', a: 'Not as standard, but this can be added as an optional extra. This will allow you to adjust the brightness and turn your sign on/off remotely.' },
  { q: 'How long is the cable?', a: '2m cable from the power adaptor. The signs are run from a 12v plug.' },
  { q: 'What plug/power adaptor do the signs use?', a: 'The signs use a 12v plug adaptor. A battery pack option is also available as an extra.' },
  { q: 'Can your signs be used outdoors?', a: 'For outdoor use, we offer a special outdoor protection box. Splashproofing is also available for occasional outdoor use such as events.' },
  { q: 'Do you offer colour-changing neon signs?', a: 'Yes, we offer an RGB colour-changing option which allows you to change colours and effects with a remote control.' },
  { q: "What's the average weight of an LED Neon sign?", a: 'LED neon signs are lightweight — between 2 to 3 kilograms depending on size and design. Suitable for mounting on most walls without additional support.' },
  { q: 'What are the perks of a LED Neon Sign?', a: 'Energy-efficient (uses significantly less power), highly durable (flexible and shatterproof, no broken glass), safe & low-maintenance (no harmful gases, does not overheat), versatile & easy to install. LED neon is the modern lighting solution that outshines traditional neon in every way.' },
];

const TESTIMONIALS = [
  { name: 'Kelly J.', text: 'My new neon sign is amazing! The colors are so vibrant, and it\'s the perfect addition to my creative studio. The entire experience was smooth, from design to delivery. The sign is eye-catching and has already received tons of compliments. Can\'t wait to order my next one!' },
  { name: 'Jessica H.', text: 'I got a neon sign as a gift for my husband, and he was blown away! The design was spot-on, and the colors are vibrant and eye-catching. The sign was well-packaged, and the setup was straightforward. The customer service team was incredibly helpful in making sure everything was perfect. We love it so much that we\'re considering getting another one for our outdoor patio!' },
  { name: 'Sarah K.', text: 'I\'ve been searching for the perfect neon sign for my living room for months, and this company delivered beyond my expectations. The neon is bright, beautiful, and exactly what I envisioned. The quality is superb, and it was packaged securely to prevent any damage during shipping. I\'m already thinking of ordering another one for my office!' },
  { name: 'David L.', text: 'This is my second purchase from this company, and once again, they\'ve delivered a top-quality product. The custom neon sign I ordered for my business is a real showstopper. It\'s bold, bright, and draws customers in from the street. The attention to detail is impressive, and I couldn\'t be happier with the results.' },
  { name: 'Emily S.', text: 'I ordered a custom neon sign for my home bar, and I couldn\'t be more thrilled! The colors are incredibly vibrant, and the craftsmanship is impeccable. It\'s the perfect finishing touch to my space. The customer service was excellent.' },
];

const BASE_PRICE = 9900; // £99 base
const SMALL_MAX = 12600; // £126 max for small/short text
const LARGE_MAX = 43700; // £437 max for large/long text

export function CustomiserPage() {
  const [lines, setLines] = useState<string[]>(['Neon Lab']);
  const [color, setColor] = useState<(typeof NEON_COLORS)[number]>(NEON_COLORS[0]);
  const [font, setFont] = useState<(typeof CUSTOMISER_FONTS)[number]>(CUSTOMISER_FONTS[0]);
  const [size, setSize] = useState<(typeof CUSTOMISER_SIZES)[number]>(CUSTOMISER_SIZES[1]);
  const [backboardType, setBackboardType] = useState<(typeof BACKBOARD_TYPES)[number]>(BACKBOARD_TYPES[0]);
  const [backboardColour, setBackboardColour] = useState<(typeof BACKBOARD_COLOURS)[number]>(BACKBOARD_COLOURS[0]);
  const [mounting, setMounting] = useState<(typeof CUSTOMISER_MOUNTING)[number]>(CUSTOMISER_MOUNTING[0]);
  const [extras, setExtras] = useState<string[]>([]);
  const [productionSpeed, setProductionSpeed] = useState<(typeof PRODUCTION_SPEEDS)[number]>(PRODUCTION_SPEEDS[0]);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showFontTooltip, setShowFontTooltip] = useState<string | null>(null);

  const { add } = useCart();

  const extrasPrice = extras.reduce((s, name) => {
    const e = CUSTOMISER_EXTRAS.find((x) => x.name === name);
    return s + (e?.priceAdd ?? 0);
  }, 0);
  const rawTotal =
    BASE_PRICE +
    size.priceAdd +
    backboardType.priceAdd +
    mounting.priceAdd +
    extrasPrice +
    productionSpeed.priceAdd;
  // Cap: small/short text max £126, large/long text max £437
  const isSmallSize = size.cm <= 60;
  const cap = isSmallSize ? SMALL_MAX : LARGE_MAX;
  const total = Math.min(rawTotal, cap);

  const toggleExtra = (name: string) => {
    setExtras((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  const updateLine = (idx: number, val: string) => {
    const maxChars = size.lettersPerLine;
    setLines((prev) => prev.map((l, i) => (i === idx ? val.slice(0, maxChars) : l)));
  };

  const addLine = () => {
    if (lines.length < 3) setLines([...lines, '']);
  };

  const removeLine = (idx: number) => {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    const textContent = lines.filter((l) => l.trim()).join(' / ');
    const variantParts = [
      color.name,
      font.name,
      `${size.name} (${size.cm}cm)`,
      backboardType.name,
      backboardColour.name,
      mounting.name,
      productionSpeed.name,
    ];
    if (extras.length) variantParts.push(extras.join(', '));
    add({
      id: `custom-${Date.now()}`,
      name: `Custom Neon: "${textContent}"`,
      price: total,
      image_url: null,
      quantity: 1,
      variant: variantParts.join(' / '),
    });
    navigate('/checkout');
  };

  const handleShare = useCallback(async () => {
    const text = lines.filter((l) => l.trim()).join(' / ');
    const shareText = `Check out my custom neon sign design: "${text}" — ${color.name}, ${font.name}, ${size.name}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Neon Design', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Design details copied to clipboard!');
      }
    } catch {
      // user cancelled share
    }
  }, [lines, color, font, size]);

  return (
    <div>
     {/* HEADER */}
<section className="relative overflow-hidden border-b border-white/10 animate-fade-in">
  {/* Thin white gradient border lines */}
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />
  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

  {/* Background Gradients & Blobs */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0a0a0f] to-[#0a1a2e]" />
  <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[100px] rgb-blob animate-pulse" style={{ background: 'var(--neon-pink)', opacity: 0.22 }} />
  <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] rgb-blob-2" style={{ background: 'var(--neon-blue)', opacity: 0.16 }} />
  <div className="absolute top-2/3 left-2/3 w-64 h-64 rounded-full blur-[80px] rgb-blob-3" style={{ background: 'var(--neon-purple)', opacity: 0.14 }} />

  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center z-10">
    
    {/* Headline with onload entrance animation */}
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight animate-fade-in-down">
  Neon Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)]">Customiser</span>
</h1>
    
    <p className="text-gray-300 mt-4 max-w-xl mx-auto text-base sm:text-lg font-light animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      Design your custom neon sign and see it come to life in real time. Type your text, pick your colour, and watch the preview update instantly.
    </p>

    {/* Feature Badges with staggered entrance animation */}
    <div className="flex items-center justify-center gap-4 sm:gap-8 mt-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {[
        { icon: Truck, label: 'Free Worldwide Delivery' },
        { icon: ShieldCheck, label: '24 Month Warranty' },
        { icon: Award, label: 'Premium Quality' },
      ].map((b, i) => (
        <div 
          key={i} 
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm text-gray-200 text-xs sm:text-sm font-medium hover:border-[var(--neon-pink)]/40 transition-colors"
        >
          <b.icon size={16} className="text-[var(--neon-pink)] shrink-0" /> 
          <span>{b.label}</span>
        </div>
      ))}
    </div>

  </div>
</section>
<SectionDivider/>

      {/* CUSTOMISER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: LIVE PREVIEW */}
          <div className="lg:sticky lg:top-24 self-start">
            <PreviewSandbox
              lines={lines}
              color={color}
              font={font}
              size={size}
              backboardType={backboardType}
              backboardColour={backboardColour}
              showMeasurements={showMeasurements}
              setShowMeasurements={setShowMeasurements}
              onShare={handleShare}
            />

            {/* Price breakdown */}
            <div className="mt-4 bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Base Price</span>
                <span className="text-white font-semibold">{formatPrice(BASE_PRICE)}</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Size: {size.name} ({size.cm}cm)</span>
                <span className="text-white font-semibold">+{formatPrice(size.priceAdd)}</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Backboard: {backboardType.name}</span>
                <span className="text-white font-semibold">+{formatPrice(backboardType.priceAdd)}</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Mounting: {mounting.name}</span>
                <span className="text-white font-semibold">+{formatPrice(mounting.priceAdd)}</span>
              </div>
              {extras.map((e) => {
                const ex = CUSTOMISER_EXTRAS.find((x) => x.name === e);
                return (
                  <div key={e} className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{e}</span>
                    <span className="text-white font-semibold">+{formatPrice(ex?.priceAdd ?? 0)}</span>
                  </div>
                );
              })}
              {productionSpeed.priceAdd > 0 && (
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">Speed: {productionSpeed.name}</span>
                  <span className="text-white font-semibold">+{formatPrice(productionSpeed.priceAdd)}</span>
                </div>
              )}
              <div className="border-t border-white/10 mt-3 pt-3 flex items-center justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-[var(--neon-pink)] text-2xl font-bold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="mt-4 bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-[var(--neon-pink)]" />
                <span className="text-white font-semibold text-sm">Estimated Arrival</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="text-center">
                  <div className="text-white font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                  <div className="mt-1">Order placed</div>
                </div>
                <div className="flex-1 mx-3 h-px bg-white/10" />
                <div className="text-center">
                  <div className="text-white font-medium">{getDispatchRange(productionSpeed)}</div>
                  <div className="mt-1">Order dispatches</div>
                </div>
                <div className="flex-1 mx-3 h-px bg-white/10" />
                <div className="text-center">
                  <div className="text-[var(--neon-pink)] font-medium">{getDeliveryDate(productionSpeed)}</div>
                  <div className="mt-1">Delivered!</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS */}
          <div className="space-y-8">
            {/* Text — multi-line */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-semibold">1. Your Text</label>
                <span className="text-gray-500 text-xs">{lines.length}/3 lines · {size.lettersPerLine} chars/line max</span>
              </div>
              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => updateLine(idx, e.target.value)}
                        placeholder={`Line ${idx + 1}...`}
                        maxLength={size.lettersPerLine}
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors"
                      />
                      {lines.length > 1 && (
                        <button
                          onClick={() => removeLine(idx)}
                          className="w-10 h-10 shrink-0 rounded-xl border border-white/15 text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                    {/* Per-line live preview */}
                    <div className="mt-1.5 bg-[#12121a] rounded-lg px-4 py-2 border border-white/5 flex items-center justify-center min-h-[36px]">
                      <span
                        className="neon-text leading-none break-words text-center"
                        style={{
                          color: color.hex,
                          fontFamily: `'${font.family}', sans-serif`,
                          fontWeight: font.weight,
                          fontSize: '20px',
                        }}
                      >
                        {line || '\u00A0'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {lines.length < 3 && (
                <button
                  onClick={addLine}
                  className="mt-2 flex items-center gap-1.5 text-sm text-[var(--neon-pink)] hover:underline"
                >
                  <Plus size={15} /> Add line
                </button>
              )}
            </div>

            {/* Colour */}
            <div>
              <label className="block text-white font-semibold mb-3">2. Choose Colour</label>
              <div className="flex flex-wrap gap-3">
                {NEON_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={`relative w-12 h-12 rounded-xl transition-all ${
                      color.name === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ background: c.hex, boxShadow: `0 0 14px ${c.hex}88` }}
                    title={c.name}
                  >
                    {color.name === c.name && <Check size={18} className="absolute inset-0 m-auto text-black" />}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">{color.name}</p>
            </div>

            {/* Font */}
            <div>
              <label className="block text-white font-semibold mb-3">3. Choose Font</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {CUSTOMISER_FONTS.map((f) => (
                  <div key={f.name} className="relative">
                    <button
                      onClick={() => setFont(f)}
                      onMouseEnter={() => setShowFontTooltip(f.name)}
                      onMouseLeave={() => setShowFontTooltip(null)}
                      className={`w-full rounded-xl border py-3 px-2 text-center transition-all ${
                        font.name === f.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span className="block text-xl leading-tight" style={{ fontFamily: `'${f.family}', sans-serif`, fontWeight: f.weight }}>
                        Aa
                      </span>
                      <span className="text-gray-400 text-[10px] mt-0.5 block truncate">{f.name}</span>
                    </button>
                    {showFontTooltip === f.name && (
                      <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-black/90 text-white text-xs whitespace-nowrap pointer-events-none">
                        {f.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-white font-semibold mb-3">4. Choose Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CUSTOMISER_SIZES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSize(s)}
                    className={`rounded-xl border py-3 px-3 text-center transition-all ${
                      size.name === s.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <span className="block text-white font-semibold text-sm">{s.name}</span>
                    <span className="block text-gray-400 text-xs">{s.inches}</span>
                    <span className="block text-gray-500 text-[10px] mt-0.5">{s.lettersPerLine} letters/line</span>
                    <span className="block text-[var(--neon-pink)] text-xs mt-1">{s.priceAdd === 0 ? 'Included' : `+${formatPrice(s.priceAdd)}`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Backboard type */}
            <div>
              <label className="block text-white font-semibold mb-3">5. Choose Backboard</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BACKBOARD_TYPES.map((b) => (
                  <div key={b.name} className="relative group">
                    <button
                      onClick={() => setBackboardType(b)}
                      className={`w-full rounded-xl border py-4 px-3 text-center transition-all ${
                        backboardType.name === b.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span className="block text-white text-sm font-medium">{b.name}</span>
                      <span className="block text-gray-500 text-[10px] mt-1 leading-tight">{b.desc}</span>
                      <span className="block text-[var(--neon-pink)] text-xs mt-1.5">{b.priceAdd === 0 ? 'Free' : `+${formatPrice(b.priceAdd)}`}</span>
                    </button>
                    {/* Hover preview */}
                    <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none">
                      <BackboardPreview type={b.name} color={color} font={font} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backboard colour */}
            <div>
              <label className="block text-white font-semibold mb-3">6. Backboard Colour</label>
              <div className="grid grid-cols-3 gap-3">
                {BACKBOARD_COLOURS.map((bc) => (
                  <button
                    key={bc.name}
                    onClick={() => setBackboardColour(bc)}
                    className={`rounded-xl border py-4 px-3 text-center transition-all ${
                      backboardColour.name === bc.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mx-auto mb-2 border border-white/20"
                      style={{ background: bc.hex === 'transparent' ? 'repeating-linear-gradient(45deg, #333, #333 3px, #555 3px, #555 6px)' : bc.hex }}
                    />
                    <span className="text-white text-sm font-medium">{bc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mounting */}
            <div>
              <label className="block text-white font-semibold mb-3">7. Mounting Option</label>
              <div className="space-y-2.5">
                {CUSTOMISER_MOUNTING.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMounting(m)}
                    className={`w-full flex items-start justify-between gap-3 rounded-xl border py-3.5 px-4 text-left transition-all ${
                      mounting.name === m.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block text-white text-sm font-medium">{m.name}</span>
                      <span className="block text-gray-500 text-xs mt-0.5 leading-relaxed">{m.desc}</span>
                    </div>
                    <span className="text-[var(--neon-pink)] text-sm shrink-0">{m.priceAdd === 0 ? 'Free' : `+${formatPrice(m.priceAdd)}`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <label className="block text-white font-semibold mb-3">8. Optional Extras</label>
              <div className="space-y-2.5">
                {CUSTOMISER_EXTRAS.map((e) => (
                  <button
                    key={e.name}
                    onClick={() => toggleExtra(e.name)}
                    className={`w-full flex items-start justify-between gap-3 rounded-xl border py-3.5 px-4 text-left transition-all ${
                      extras.includes(e.name) ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${extras.includes(e.name) ? 'bg-[var(--neon-pink)] border-[var(--neon-pink)]' : 'border-white/30'}`}>
                        {extras.includes(e.name) && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-white text-sm font-medium">{e.name}</span>
                        <span className="block text-gray-500 text-xs mt-0.5 leading-relaxed">{e.desc}</span>
                      </div>
                    </div>
                    <span className="text-[var(--neon-pink)] text-sm shrink-0">{e.priceAdd === 0 ? 'Free' : `+${formatPrice(e.priceAdd)}`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Production Speed */}
            <div>
              <label className="block text-white font-semibold mb-3">9. Production Speed</label>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                Stated in working days. Standard is the most popular or choose one of our faster services. Production speed is the time taken to make your order before shipping on Next Day Delivery (UK only).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRODUCTION_SPEEDS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setProductionSpeed(p)}
                    className={`rounded-xl border py-4 px-3 text-center transition-all ${
                      productionSpeed.name === p.name ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10' : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    <span className="block text-white text-sm font-medium">{p.name}</span>
                    <span className="block text-gray-500 text-[10px] mt-1 leading-tight">{p.desc}</span>
                    <span className="block text-[var(--neon-pink)] text-xs mt-1.5">{p.priceAdd === 0 ? 'Included' : `+${formatPrice(p.priceAdd)}`}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-[var(--neon-pink)] text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
            >
              <ShoppingBag size={20} /> Add to Cart — {formatPrice(total)}
            </button>
          </div>
        </div>
      </section>
<SectionDivider/>
      {/* WHY CHOOSE US */}
     <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 rounded-3xl animate-fade-in">
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
      { icon: Wrench, title: 'Easy Mounting', desc: "If you don't want to damage your wall, you can purchase our mounting tapes that can carry up to 50kg." },
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
<SectionDivider/>
      {/* FAQ */}
<section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden animate-fade-in">
  {/* Thin white gradient border lines */}
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

  {/* Ambient background glow */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--neon-purple)]/10 blur-[100px] rounded-full pointer-events-none" />

  <div className="text-center mb-12 relative z-10 animate-fade-in-down">
    <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">FAQ</h2>
    <p className="text-gray-300 mt-3 text-sm sm:text-base font-light">Everything you need to know about our custom neon signs</p>
  </div>

  <div className="space-y-4 relative z-10">
    {FAQ_ITEMS.map((item, i) => (
      <div 
        key={i} 
        className="group bg-[#0f0b1e]/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[var(--neon-pink)]/50 transition-all duration-300 overflow-hidden shadow-lg animate-fade-in-up"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <button
          onClick={() => setOpenFaq(openFaq === i ? null : i)}
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
        >
          <span className="text-white font-semibold text-sm sm:text-base group-hover:text-[var(--neon-pink)] transition-colors">{item.q}</span>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 ml-4 group-hover:bg-white/10 transition-colors">
            <ChevronDown
              size={18}
              className={`text-gray-300 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[var(--neon-pink)]' : ''}`}
            />
          </div>
        </button>
        {openFaq === i && (
          <div className="px-5 sm:px-6 pb-6 pt-0 animate-fade-in">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light border-t border-white/5 pt-4">{item.a}</p>
          </div>
        )}
      </div>
    ))}
  </div>
</section>
<SectionDivider/>
{/* TESTIMONIALS */}
<section className="relative bg-[#0a0a0f]/80 backdrop-blur-xl border-y border-white/10 py-10 overflow-hidden animate-fade-in">
  {/* Thin white gradient border lines */}
  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-14 animate-fade-in-down">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">What People Are Saying</h2>
      <div className="flex items-center justify-center gap-3 mt-4 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full w-fit mx-auto backdrop-blur-md shadow-inner">
        <StarRating rating={5} size={20} />
        <span className="text-white text-base font-bold">4.9 / 5</span>
        <span className="text-gray-400 text-xs sm:text-sm border-l border-white/10 pl-3">from 2,000+ customers</span>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {TESTIMONIALS.map((t, i) => (
        <div 
          key={i} 
          className="group relative bg-[#0f0b1e]/60 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-[var(--neon-pink)]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(255,42,109,0.2)] flex flex-col justify-between animate-fade-in-up"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {/* Subtle inner neon border highlight glow on hover */}
          <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--neon-pink)]/30 transition-colors pointer-events-none" />

          <div>
            <StarRating rating={5} size={16} />
            <p className="text-gray-300 text-sm mt-4 leading-relaxed font-light line-clamp-5">{t.text}</p>
          </div>

          <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-pink)] to-[var(--neon-purple)] flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              {t.name.charAt(0)}
            </div>
            <p className="text-white font-semibold text-sm tracking-wide">{t.name}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<SectionDivider/>
    </div>
  );
}

/* ===== HELPERS ===== */

function getDispatchRange(speed: { name: string }): string {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  if (speed.name === 'Standard') {
    start.setDate(start.getDate() + 7);
    end.setDate(end.getDate() + 10);
  } else if (speed.name === 'Express') {
    start.setDate(start.getDate() + 4);
    end.setDate(end.getDate() + 6);
  } else {
    start.setDate(start.getDate() + 2);
    end.setDate(end.getDate() + 3);
  }
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(start)}–${fmt(end)}`;
}

function getDeliveryDate(speed: { name: string }): string {
  const now = new Date();
  const d = new Date(now);
  if (speed.name === 'Standard') d.setDate(d.getDate() + 11);
  else if (speed.name === 'Express') d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ===== BACKBOARD HOVER PREVIEW ===== */

function BackboardPreview({
  type,
  color,
  font,
}: {
  type: string;
  color: typeof NEON_COLORS[number];
  font: typeof CUSTOMISER_FONTS[number];
}) {
  const sampleText = 'NEON';
  const wallBg = '#1a1a25';

  // Backboard wrapper style per type
  let backboardWrap: React.CSSProperties;
  if (type === 'Cut to Letter') {
    // No visible backboard — letters float freely
    backboardWrap = { background: 'transparent', padding: '0', display: 'inline-block' };
  } else if (type === 'Cut to Shape') {
    // Backboard cut closely around the text — organic rounded shape
    backboardWrap = {
      background: 'rgba(255,255,255,0.12)',
      borderRadius: '45% 55% 45% 55% / 55% 45% 55% 45%',
      padding: '16px 24px',
      display: 'inline-block',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
    };
  } else {
    // Board — rectangular backboard
    backboardWrap = {
      background: 'rgba(255,255,255,0.12)',
      borderRadius: '6px',
      padding: '16px 24px',
      display: 'inline-block',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
    };
  }

  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/15 shadow-2xl p-4 w-56">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ background: wallBg, padding: '20px', minHeight: '80px' }}
      >
        <div style={backboardWrap}>
          <span
            className="neon-text leading-none"
            style={{
              color: color.hex,
              fontFamily: `'${font.family}', sans-serif`,
              fontWeight: font.weight,
              fontSize: '28px',
              whiteSpace: 'nowrap',
            }}
          >
            {sampleText}
          </span>
        </div>
      </div>
      <p className="text-gray-400 text-[10px] text-center mt-2 capitalize">{type}</p>
    </div>
  );
}

/* ===== LIVE PREVIEW SANDBOX ===== */

type PreviewProps = {
  lines: string[];
  color: typeof NEON_COLORS[number];
  font: typeof CUSTOMISER_FONTS[number];
  size: typeof CUSTOMISER_SIZES[number];
  backboardType: typeof BACKBOARD_TYPES[number];
  backboardColour: typeof BACKBOARD_COLOURS[number];
  showMeasurements: boolean;
  setShowMeasurements: (v: boolean) => void;
  onShare: () => void;
};

function PreviewSandbox({
  lines,
  color,
  font,
  size,
  backboardType,
  backboardColour,
  showMeasurements,
  setShowMeasurements,
  onShare,
}: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [roomMode, setRoomMode] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (textWrapRef.current) {
        const rect = textWrapRef.current.getBoundingClientRect();
        setTextSize({ width: rect.width, height: rect.height });
      }
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    const t = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [lines, color, font, size, backboardType, backboardColour]);

  // px per cm: map the selected size's cm to the container width
  // The sign's max width = container width (with padding)
  const padding = 48;
  const availableWidth = containerSize.width - padding * 2;
  const pxPerCm = availableWidth > 0 ? availableWidth / size.cm : 0;

  // The actual sign width in cm = textWidthPx / pxPerCm
  const signWidthCm = pxPerCm > 0 ? textSize.width / pxPerCm : 0;
  // Height: the text height in px, converted to cm
  const signHeightCm = pxPerCm > 0 ? textSize.height / pxPerCm : 0;

  const wallBg = '#1a1a25';
  const dimLineColour = '#888';
  const dimTextColour = '#aaa';

  // Backboard wrapper style — wraps around the text content
  let backboardStyle: React.CSSProperties = {};
  if (backboardType.name === 'Cut to Letter') {
    backboardStyle = { background: 'transparent', padding: '0', borderRadius: '0' };
  } else if (backboardType.name === 'Cut to Shape') {
    backboardStyle = {
      background: backboardColour.hex === 'transparent' ? 'rgba(255,255,255,0.10)' : backboardColour.hex,
      borderRadius: '45% 55% 45% 55% / 55% 45% 55% 45%',
      padding: '16px 24px',
    };
  } else {
    // Board — rectangular
    backboardStyle = {
      background: backboardColour.hex === 'transparent' ? 'rgba(255,255,255,0.10)' : backboardColour.hex,
      borderRadius: '6px',
      padding: '16px 24px',
    };
  }

  // Font size scaling: the largest line determines the font size
  // We scale font so that the widest line fits within the available width
  const longestLine = Math.max(...lines.map((l) => l.length || 1), 1);
  // Approximate: each character ~0.6em wide, so fontSize ≈ availableWidth / (longestLine * 0.6)
  // But clamp to reasonable bounds based on size
  const maxFontSize = Math.min(size.cm * 1.2, 120);
  const minFontSize = 12;
  const estimatedFontSize = Math.max(minFontSize, Math.min(maxFontSize, availableWidth / (longestLine * 0.62)));

  return (
    <div>
      {/* Toggle + Share */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm font-medium">Live Preview</span>
          <Info size={14} className="text-gray-600" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoomMode(!roomMode)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              roomMode
                ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]'
                : 'border-white/15 text-gray-400 hover:border-white/30'
            }`}
          >
            {roomMode ? 'Room View' : 'Flat View'}
          </button>
          <button
            onClick={onShare}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-400 hover:border-white/30 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Share2 size={13} /> Share
          </button>
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showMeasurements
                ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]'
                : 'border-white/15 text-gray-400 hover:border-white/30'
            }`}
          >
            {showMeasurements ? 'Hide Measurements' : 'Show Measurements'}
          </button>
        </div>
      </div>

      {/* Sandbox */}
      <div
        ref={containerRef}
        className={`relative ${roomMode ? 'aspect-[4/3]' : 'aspect-square'} rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden transition-all`}
        style={{
          background: roomMode
            ? 'linear-gradient(180deg, #2a2a35 0%, #1e1e28 40%, #15151c 60%, #0e0e13 100%)'
            : wallBg,
          padding: roomMode ? '0' : `${padding}px`,
        }}
      >
        {roomMode ? (
          <>
            {/* Room wall background */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, #2a2a35 0%, #222230 35%, #1a1a22 55%, #14141a 100%)',
              }}
            />
            {/* Wall texture */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 40%)',
              }}
            />
            {/* Floor line */}
            <div className="absolute bottom-[20%] left-0 right-0 h-px bg-black/40" />
            {/* Floor area */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ background: 'linear-gradient(180deg, #0e0e13 0%, #08080c 100%)' }} />

            {/* Sofa SVG */}
            <svg viewBox="0 0 200 60" className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[70%] h-auto opacity-90" preserveAspectRatio="xMidYMax meet">
              {/* Sofa back */}
              <rect x="20" y="15" width="160" height="25" rx="6" fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="0.5"/>
              {/* Sofa base */}
              <rect x="15" y="35" width="170" height="18" rx="5" fill="#15152a" stroke="#2a2a3e" strokeWidth="0.5"/>
              {/* Cushions */}
              <rect x="25" y="20" width="45" height="18" rx="4" fill="#20203a"/>
              <rect x="77" y="20" width="45" height="18" rx="4" fill="#20203a"/>
              <rect x="129" y="20" width="45" height="18" rx="4" fill="#20203a"/>
              {/* Arms */}
              <rect x="10" y="22" width="12" height="30" rx="4" fill="#1a1a2e"/>
              <rect x="178" y="22" width="12" height="30" rx="4" fill="#1a1a2e"/>
              {/* Legs */}
              <rect x="18" y="52" width="5" height="6" rx="1" fill="#0a0a0f"/>
              <rect x="177" y="52" width="5" height="6" rx="1" fill="#0a0a0f"/>
            </svg>

            {/* Neon sign on wall */}
            <div className="relative z-10 text-center flex flex-col items-center justify-center" style={{ maxWidth: '70%', marginTop: '-5%' }}>
              <div ref={textWrapRef} style={roomMode ? { ...backboardStyle, padding: '12px 20px' } : backboardStyle} className="inline-flex flex-col items-center gap-1">
                {lines.filter((l) => l.trim()).length === 0 ? (
                  <span
                    className="neon-text leading-none opacity-60 preview-stylish"
                    style={{
                      color: color.hex,
                      fontFamily: `'${font.family}', sans-serif`,
                      fontWeight: font.weight,
                      fontSize: `${Math.max(16, estimatedFontSize * 0.7)}px`,
                    }}
                  >
                    Your Neon ✦
                  </span>
                ) : (
                  lines.map((line, i) => (
                    <span
                      key={i}
                      className="neon-text leading-none break-words animate-pulse-glow preview-stylish"
                      style={{
                        color: color.hex,
                        fontFamily: `'${font.family}', sans-serif`,
                        fontWeight: font.weight,
                        fontSize: `${Math.max(16, estimatedFontSize * 0.7)}px`,
                        maxWidth: '100%',
                      }}
                    >
                      {line || '\u00A0'}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Room label */}
            <div className="absolute top-3 left-3 text-xs uppercase tracking-wider text-gray-500 opacity-50">Room Preview</div>
          </>
        ) : (
        <>
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${dimLineColour} 1px, transparent 1px), linear-gradient(90deg, ${dimLineColour} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* The neon text with backboard wrapper */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center" style={{ maxWidth: '100%' }}>
          <div ref={textWrapRef} style={backboardStyle} className="inline-flex flex-col items-center gap-1">
            {lines.filter((l) => l.trim()).length === 0 ? (
              <span
                className="neon-text leading-none opacity-50 preview-stylish"
                style={{
                  color: color.hex,
                  fontFamily: `'${font.family}', sans-serif`,
                  fontWeight: font.weight,
                  fontSize: `${estimatedFontSize}px`,
                }}
              >
                Your Neon ✦
              </span>
            ) : (
              lines.map((line, i) => (
                <span
                  key={i}
                  className="neon-text leading-none break-words preview-stylish"
                  style={{
                    color: color.hex,
                  fontFamily: `'${font.family}', sans-serif`,
                  fontWeight: font.weight,
                  fontSize: `${estimatedFontSize}px`,
                  maxWidth: '100%',
                }}
              >
                {line || '\u00A0'}
              </span>
            ))
          )}
        </div>
        </div>
        </>
        )}

        {/* Measurement lines */}
        {showMeasurements && !roomMode && textSize.width > 0 && (
          <>
            {/* Width dimension (top) */}
            <div
              className="absolute top-4 flex items-center"
              style={{
                left: `${50 - (textSize.width / containerSize.width) * 50}%`,
                width: `${textSize.width}px`,
              }}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3" style={{ background: dimLineColour }} />
              <div className="flex-1 h-px" style={{ background: dimLineColour }} />
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-3 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                style={{ color: dimTextColour, background: wallBg }}
              >
                {signWidthCm.toFixed(0)} cm
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3" style={{ background: dimLineColour }} />
            </div>

            {/* Height dimension (right) */}
            <div
              className="absolute right-4 flex flex-col items-center"
              style={{
                top: `${50 - (textSize.height / containerSize.height) * 50}%`,
                height: `${textSize.height}px`,
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3" style={{ background: dimLineColour }} />
              <div className="flex-1 w-px" style={{ background: dimLineColour }} />
             <div
  className="absolute top-1/2 -translate-y-1/2 -right-3 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
  style={{ color: dimTextColour, background: wallBg, writingMode: 'vertical-rl' }}
>
  {signHeightCm.toFixed(0)} cm
</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3" style={{ background: dimLineColour }} />
            </div>

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: dimLineColour }} />
            <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 rounded-tr-lg" style={{ borderColor: dimLineColour }} />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 rounded-bl-lg" style={{ borderColor: dimLineColour }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: dimLineColour }} />
          </>
        )}

        {/* Watermark */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider" style={{ color: dimTextColour, opacity: 0.4 }}>
          Neon Lab Preview
        </div>
      </div>

      {/* Dimension summary */}
      {showMeasurements && (
        <div className="mt-3 flex items-center justify-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Width:</span>
            <span className="text-white font-medium">{signWidthCm > 0 ? `${signWidthCm.toFixed(0)} cm` : '—'}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Height:</span>
            <span className="text-white font-medium">{signHeightCm > 0 ? `${signHeightCm.toFixed(0)} cm` : '—'}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Size:</span>
            <span className="text-white font-medium">{size.name} ({size.inches})</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Max chars/line:</span>
            <span className="text-white font-medium">{size.lettersPerLine}</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-start justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 max-w-md mx-auto">
        <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="text-gray-400 text-xs leading-relaxed text-center">{COLOR_VARIATION_NOTE}</p>
      </div>
    </div>
  );
}
