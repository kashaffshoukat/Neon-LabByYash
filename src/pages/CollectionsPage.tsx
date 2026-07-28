import { useEffect, useState } from 'react';
import { supabase } from '../lib';
import type { Collection } from '../types';
import { navigate } from '../router';
import { SectionDivider } from '../components/SectionDivider';

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('collections').select('*').order('name');
      setCollections(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white">All Collections</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Illuminate your space with our stunning range of neon signs, designed to add a unique glow to
          any setting. Whether you're looking to brighten up your home, create a standout display for
          your business, or add a touch of personality to your event, our neon collections offer
          something for everyone.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {collections.map((col) => (
            <button key={col.id} onClick={() => navigate(`/collections/${col.slug}`)} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
              {col.image_url && <img src={col.image_url} alt={col.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-white text-lg font-bold">{col.name}</h3>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
