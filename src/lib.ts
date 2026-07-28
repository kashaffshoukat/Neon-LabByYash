import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);

export const NEON_COLORS = [
  { name: 'Hot Pink', hex: '#ff2d95' },
  { name: 'Ice Blue', hex: '#00e5ff' },
  { name: 'Neon Green', hex: '#39ff14' },
  { name: 'Orange', hex: '#ff6b00' },
  { name: 'Purple', hex: '#b026ff' },
  { name: 'Red', hex: '#ff1744' },
  { name: 'Yellow', hex: '#fff200' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Warm White', hex: '#fff4e0' },
] as const;

export const NEON_FONTS = [
  { name: 'Script', family: 'Caveat', weight: 700 },
  { name: 'Bold', family: 'Outfit', weight: 800 },
  { name: 'Classic', family: 'Outfit', weight: 500 },
] as const;

// Full font list for the customiser (40+ fonts)
// Google Font family names — loaded via index.html
export const CUSTOMISER_FONTS = [
  { name: 'Alexa', family: 'Pacifico', weight: 400 },
  { name: 'Amanda', family: 'Dancing Script', weight: 700 },
  { name: 'Amsterdam', family: 'Bebas Neue', weight: 400 },
  { name: 'Austin', family: 'Anton', weight: 400 },
  { name: 'Avante', family: 'Rajdhani', weight: 600 },
  { name: 'Barcelona', family: 'Montserrat', weight: 700 },
  { name: 'Bayview', family: 'Quicksand', weight: 500 },
  { name: 'Beachfront', family: 'Pacifico', weight: 400 },
  { name: 'Bellview', family: 'Righteous', weight: 400 },
  { name: 'Buttercup', family: 'Sacramento', weight: 400 },
  { name: 'Chelsea', family: 'Playfair Display', weight: 700 },
  { name: 'ClassicType', family: 'Lora', weight: 500 },
  { name: 'Freehand', family: 'Caveat', weight: 700 },
  { name: 'Freespirit', family: 'Comfortaa', weight: 400 },
  { name: 'Greenworld', family: 'Satisfy', weight: 400 },
  { name: 'Loveneon', family: 'Lobster', weight: 400 },
  { name: 'Lovenote', family: 'Great Vibes', weight: 400 },
  { name: 'Marquee', family: 'Anton', weight: 400 },
  { name: 'Mayfair', family: 'Cormorant Garamond', weight: 600 },
  { name: 'Melbourne', family: 'Oswald', weight: 500 },
  { name: 'Monaco', family: 'Outfit', weight: 800 },
  { name: 'NeonGlow', family: 'Audiowide', weight: 400 },
  { name: 'Neonlite', family: 'Orbitron', weight: 500 },
  { name: 'Neonscript', family: 'Permanent Marker', weight: 400 },
  { name: 'Neontrace', family: 'Major Mono Display', weight: 400 },
  { name: 'Neotokyo', family: 'Russo One', weight: 400 },
  { name: 'Nevada', family: 'Bebas Neue', weight: 400 },
  { name: 'Newcursive', family: 'Dancing Script', weight: 500 },
  { name: 'Northshore', family: 'Quicksand', weight: 600 },
  { name: 'Photogenic', family: 'Allura', weight: 400 },
  { name: 'Rocket', family: 'Russo One', weight: 400 },
  { name: 'Royalty', family: 'Cinzel', weight: 700 },
  { name: 'Scifi', family: 'Orbitron', weight: 700 },
  { name: 'Signature', family: 'Allura', weight: 400 },
  { name: 'Sorrento', family: 'Playfair Display', weight: 500 },
  { name: 'Typewriter', family: 'Special Elite', weight: 400 },
  { name: 'Venetian', family: 'Cormorant', weight: 500 },
  { name: 'Vintage', family: 'Special Elite', weight: 400 },
  { name: 'Waikiki', family: 'Pacifico', weight: 400 },
  { name: 'Wildscript', family: 'Permanent Marker', weight: 400 },
  { name: 'Shamelon', family: 'Outfit', weight: 500 },
  { name: 'Tubes', family: 'Bebas Neue', weight: 400 },
  { name: 'Orange', family: 'Outfit', weight: 600 },
] as const;

// Sizes with letter-per-line limits
// Pricing: small (40cm) max = £126 (12600p), large (200cm) max = £437 (43700p)
// priceAdd is the ADDITIONAL amount on top of the £99 base price.
// So 40cm total = 99 + 0 + options... capped at 126 => small designs stay ~99-126
// 200cm total = 99 + 33800 = 437 at the top end with all upgrades
export const CUSTOMISER_SIZES = [
  { name: '40cm', cm: 40, inches: '15.7"', lettersPerLine: 6, priceAdd: 0 },
  { name: '60cm', cm: 60, inches: '23.6"', lettersPerLine: 10, priceAdd: 4200 },
  { name: '80cm', cm: 80, inches: '31.5"', lettersPerLine: 14, priceAdd: 8400 },
  { name: '100cm', cm: 100, inches: '39.4"', lettersPerLine: 17, priceAdd: 12600 },
  { name: '120cm', cm: 120, inches: '47.2"', lettersPerLine: 21, priceAdd: 16800 },
  { name: '140cm', cm: 140, inches: '55.1"', lettersPerLine: 24, priceAdd: 21000 },
  { name: '160cm', cm: 160, inches: '63"', lettersPerLine: 28, priceAdd: 25200 },
  { name: '180cm', cm: 180, inches: '70.9"', lettersPerLine: 31, priceAdd: 29400 },
  { name: '200cm', cm: 200, inches: '78.7"', lettersPerLine: 35, priceAdd: 33800 },
] as const;

// Backboard types — reduced add-ons so the small/short text stays at ~£126
export const BACKBOARD_TYPES = [
  { name: 'Cut to Letter', desc: 'No visible backboard', priceAdd: 0 },
  { name: 'Cut to Shape', desc: 'Backboard is cut closely around the outside of your wording', priceAdd: 800 },
  { name: 'Board', desc: 'Backboard cut in a Rectangle around the outside of your wording', priceAdd: 1500 },
] as const;

// Backboard colours
export const BACKBOARD_COLOURS = [
  { name: 'Clear', hex: 'transparent' },
  { name: 'White', hex: '#f0f0f0' },
  { name: 'Black', hex: '#0a0a0a' },
] as const;

// Mounting options — scaled so small sizes stay ~£126, large reach ~£437
export const CUSTOMISER_MOUNTING = [
  { name: 'Wall Mounting Screws', desc: 'Wall screws come as standard with your order', priceAdd: 0 },
  { name: 'Fast Mount Kit', desc: 'Renter friendly mounting kit, no tools needed, mounts to any smooth surface in seconds without drilling', priceAdd: 500 },
  { name: 'Ceiling Hanging Kit', desc: 'Includes the ceiling hanging wire, screw kit and tool to assemble', priceAdd: 1000 },
  { name: 'Free-standing', desc: 'Comes with clear acrylic legs to stand the sign on any flat surface', priceAdd: 800 },
  { name: 'Stand-off Mounts', desc: '(20mm) Your sign will come with mounting holes suitable for stand-off mounts and the appropriate number of stand-off mounts', priceAdd: 1500 },
] as const;

// Extras
export const CUSTOMISER_EXTRAS = [
  { name: 'Remote Dimmer', desc: 'Set your sign to any brightness or turn it ON/OFF at the touch of a button', priceAdd: 800 },
  { name: 'RGB Colour Changing', desc: 'Change colours and effects with a remote control', priceAdd: 2000 },
  { name: 'Outdoor Box', desc: 'Protect your sign for permanent outdoor mounting', priceAdd: 1500 },
  { name: 'Splashproofing', desc: 'Protect your sign from accidental damage. Suitable for occasional outdoor use, such as for events. Not suitable for permanent outdoor mounting in heavy showers or frost', priceAdd: 0 },
  { name: 'Battery Pack', desc: 'When you select this option, we will send both the battery and the adaptor. You can use either of them', priceAdd: 1000 },
] as const;

// Production speeds
export const PRODUCTION_SPEEDS = [
  { name: 'Standard', desc: 'Most popular — 7-10 working days', priceAdd: 0 },
  { name: 'Express', desc: '4-6 working days', priceAdd: 1500 },
  { name: 'Rush', desc: '2-3 working days', priceAdd: 3000 },
] as const;

// Keep legacy exports for LogoUploadPage compatibility
export const NEON_SIZES = [
  { name: 'Small', cm: 40, priceAdd: 0 },
  { name: 'Medium', cm: 60, priceAdd: 3000 },
  { name: 'Large', cm: 80, priceAdd: 6000 },
  { name: 'XL', cm: 100, priceAdd: 10000 },
] as const;

export const NEON_MOUNTING = [
  { name: 'Wall Mount', priceAdd: 0 },
  { name: 'Hanging Kit', priceAdd: 1500 },
  { name: 'Stand', priceAdd: 2500 },
] as const;

export const NEON_EXTRAS = [
  { name: 'Remote Dimmer', priceAdd: 1500 },
  { name: 'RGB Colour Changing', priceAdd: 4000 },
  { name: 'Outdoor Box', priceAdd: 3000 },
] as const;

// ===== Fixed pricing constants (per the store requirements) =====
// All shop products: £126.00 flat
export const SHOP_PRODUCT_PRICE = 12600;
// Tax per product: £12.90
export const TAX_PER_ITEM = 1290;
// Delivery per product: £19.90 (flat, every product)
export const DELIVERY_CHARGE = 1990;
// Formspree endpoint for order notifications
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgnbpve';

// ===== Product sizes with prices (PKR converted to GBP at ~370 PKR/GBP) =====
// Every shop product offers these 6 size options with fixed prices.
// * = split in multiple pieces (ask for details)
export const PRODUCT_SIZES = [
  { id: '75cm',  label: '75cm',  heightCm: 24, widthCm: 75,  price: 19467, split: false },
  { id: '100cm', label: '100cm', heightCm: 32, widthCm: 100, price: 21168, split: false },
  { id: '120cm', label: '120cm', heightCm: 38, widthCm: 120, price: 22869, split: false },
  { id: '150cm', label: '150cm', heightCm: 50, widthCm: 159, price: 28809, split: true  },
  { id: '200cm', label: '200cm', heightCm: 64, widthCm: 200, price: 34506, split: true  },
  { id: '250cm', label: '250cm', heightCm: 80, widthCm: 250, price: 42498, split: true  },
] as const;

// The "from" price shown on product cards — smallest size
export const PRODUCT_FROM_PRICE = PRODUCT_SIZES[0].price;

// Color variation disclaimer shown on every product / customiser page
export const COLOR_VARIATION_NOTE =
  'Product colour may slightly vary from the images due to the difference in lighting.';

export function formatPrice(pence: number): string {
  return '£' + (pence / 100).toFixed(2);
}
