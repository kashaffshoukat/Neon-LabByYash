import { useState } from 'react';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import type { Design } from '../designs';
import { useCart, useWishlist } from '../cart';
import { formatPrice } from '../lib';
import { navigate } from '../router';

export function DesignCard({ design, index = 0 }: { design: Design; index?: number }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const isWishlisted = wishlist.has(design.id);

  const handleAdd = () => {
    add({
      id: design.id,
      name: design.title,
      price: design.price,
      image_url: design.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/designs/${design.id}`)}
      className="reveal group relative bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--neon-pink)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_var(--neon-pink)] cursor-pointer"
      style={{ transitionDelay: `${(index % 8) * 0.06}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0f]">
        <img
          src={design.image}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {design.badge && (
          <span className="absolute top-3 left-3 bg-[var(--neon-pink)] text-white text-xs font-bold px-3 py-1 rounded-full animate-fade-in-down">
            {design.badge}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            wishlist.toggle({ id: design.id, name: design.title, price: design.price, image_url: design.image, quantity: 1 });
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted ? 'bg-[var(--neon-pink)] text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm lg:text-base truncate">{design.title}</h3>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{design.description}</p>
        <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">Product colour may slightly vary from the images due to the difference in lighting.</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[var(--neon-pink)] font-bold text-sm lg:text-base">{formatPrice(design.price)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleAdd(); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white scale-105'
                : 'bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-white hover:scale-105'
            }`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
