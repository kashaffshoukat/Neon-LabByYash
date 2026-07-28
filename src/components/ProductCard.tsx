import type { Product } from '../types';
import { navigate } from '../router';
import { formatPrice } from '../lib';
import { StarRating } from './StarRating';
import { Heart } from 'lucide-react';
import { useWishlist } from '../cart';

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(product.id);

  return (
    <div className="group relative text-left bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--neon-pink)]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_48px_-12px_var(--neon-pink)] card-glow-animate">
      <button
        onClick={() => navigate(`/products/${product.slug}`)}
        className="block w-full"
      >
        <div className="relative aspect-square overflow-hidden bg-white/5">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[var(--neon-pink)] text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {!product.in_stock && (
            <span className="absolute top-3 right-3 bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          wishlist.toggle({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1,
          });
        }}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-[var(--neon-pink)] text-white'
            : 'bg-black/50 text-white hover:bg-black/70'
        }`}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      <button
        onClick={() => navigate(`/products/${product.slug}`)}
        className="block w-full p-4"
      >
        <h3 className="text-white font-medium text-sm sm:text-base truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={product.rating} size={14} />
          <span className="text-gray-500 text-xs">{product.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[var(--neon-pink)] font-bold">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-gray-500 text-sm line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
        <p className="text-gray-500 text-[11px] mt-1">Multiple sizes available</p>
      </button>
    </div>
  );
}
