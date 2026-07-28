import { useEffect, useState } from 'react';
import { supabase } from '../lib';
import type { Product, Collection } from '../types';
import { navigate } from '../router';
import { ProductCard } from '../components/ProductCard';

export function CollectionPage({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: col } = await supabase.from('collections').select('*').eq('slug', slug).maybeSingle();
      setCollection(col);
      if (col) {
        const { data: prods } = await supabase.from('products').select('*').eq('collection_id', col.id).order('created_at', { ascending: false });
        setProducts(prods ?? []);
      }
      setLoading(false);
    })();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <nav className="text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/collections')} className="hover:text-[var(--neon-pink)]">Collections</button>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{collection?.name ?? slug}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">{collection?.name ?? 'Collection'}</h1>
        {collection?.description && <p className="text-gray-400 mt-3 max-w-2xl">{collection.description}</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
