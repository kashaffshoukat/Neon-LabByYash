import { useEffect, useState } from 'react';
import { supabase } from '../lib';
import type { Review } from '../types';
import { StarRating } from '../components/StarRating';
import { BadgeCheck, ThumbsUp, Globe, ExternalLink, Sparkles, Quote, BarChart3, ArrowRight } from 'lucide-react';
import { useReveal } from '../useReveal';
import { navigate } from '../router';

const SOURCE_META: Record<string, { icon: typeof Globe; label: string; color: string }> = {
  Google: { icon: Globe, label: 'Google', color: 'text-[#4285F4]' },
  Trustpilot: { icon: ExternalLink, label: 'Trustpilot', color: 'text-[#00b67a]' },
  Website: { icon: BadgeCheck, label: 'Verified Buyer', color: 'text-[#1a73e8]' },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ReviewCard({ r, index }: { r: Review; index: number }) {
  const [helpful, setHelpful] = useState(r.helpful_count ?? 0);
  const [voted, setVoted] = useState(false);
  const gradient = r.avatar_color ?? 'from-pink-500 to-rose-500';
  const source = r.source ? SOURCE_META[r.source] ?? SOURCE_META.Website : SOURCE_META.Website;

  return (
    <div
      className="reveal group relative bg-white/[0.04] rounded-2xl p-6 border border-white/10 hover:border-[var(--neon-pink)]/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_40px_-12px_var(--neon-pink)] card-glow-animate"
      style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
    >
      <Quote size={64} className="absolute -top-2 right-4 text-white/[0.04] group-hover:text-[var(--neon-pink)]/[0.08] transition-colors duration-500" />
      <div className="flex items-start gap-3 mb-4 relative">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg`}>
          {r.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-white font-semibold text-sm">{r.author}</p>
            {r.verified !== false && (
              <span className="inline-flex items-center gap-0.5 text-[#1a73e8] text-xs font-medium animate-fade-in">
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {r.location && <span className="text-gray-500 text-xs">{r.location}</span>}
            {r.location && <span className="text-gray-600 text-xs">·</span>}
            <span className="text-gray-500 text-xs">{formatDate(r.reviewed_at ?? r.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full bg-white/[0.03] border border-white/5">
          <source.icon size={13} className={source.color} />
          <span className="text-gray-400 text-[11px] font-medium">{source.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={r.rating} size={16} />
        <span className="text-gray-500 text-xs">{r.rating.toFixed(1)}</span>
      </div>

      {r.title && <p className="text-white font-semibold text-sm mb-1.5">{r.title}</p>}
      <p className="text-gray-300 text-sm leading-relaxed">{r.body}</p>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => { if (!voted) { setHelpful((h) => h + 1); setVoted(true); } }}
          className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${voted ? 'text-[var(--neon-pink)] scale-105' : 'text-gray-500 hover:text-gray-300 hover:scale-105'}`}
        >
          <ThumbsUp size={14} className={voted ? 'fill-[var(--neon-pink)]' : ''} />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
}

export function ReviewsPage() {
  useReveal();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [animateGraph, setAnimateGraph] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('reviews').select('*').order('reviewed_at', { ascending: false, nullsFirst: false });
      setReviews(data ?? []);
      setLoading(false);
      const timer = setTimeout(() => setAnimateGraph(true), 150);
      return () => clearTimeout(timer);
    })();
  }, []);

  const totalReviewsCount = 987;
  const verifiedCount = 655;

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 4.9;
  
  const distribution = [
    { star: 5, count: 842, heightPct: 100 },
    { star: 4, count: 112, heightPct: 35 },
    { star: 3, count: 23, heightPct: 15 },
    { star: 2, count: 7, heightPct: 8 },
    { star: 1, count: 3, heightPct: 5 },
  ];

  const sourceCounts = {
    Google: 412,
    Trustpilot: 325,
    Website: 250,
  };

  const filtered = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Ambient RGB blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 rounded-full blur-[120px] rgb-blob" style={{ background: 'var(--neon-pink)', opacity: 0.07 }} />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full blur-[100px] rgb-blob-2" style={{ background: 'var(--neon-blue)', opacity: 0.06 }} />
      </div>

      <div className="relative z-10">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] text-xs font-semibold mb-5 animate-fade-in-down">
          <Sparkles size={13} /> {verifiedCount}+ Verified Customers ({totalReviewsCount}+ Reviews)
        </span>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-white animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
          Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">Reviews</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.15s' }}>
          Real reviews from real customers across Google, Trustpilot &amp; our website
        </p>
      </div>

      {/* Summary panel with Vertical Bar Chart */}
      <div className="reveal-scale relative bg-white/[0.04] rounded-3xl border border-white/10 p-6 lg:p-8 mb-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: 'var(--neon-pink)' }} />
        
        <div className="relative flex flex-col lg:flex-row gap-8 items-center justify-between">
          
          {/* Overall Rating Box */}
          <div className="text-center lg:text-left shrink-0">
            <div className="text-6xl font-extrabold text-white animate-count-pop">{avg.toFixed(1)}</div>
            <div className="flex justify-center lg:justify-start mt-1"><StarRating rating={avg} size={20} /></div>
            <p className="text-gray-400 text-sm mt-2 flex items-center justify-center lg:justify-start gap-1">
              <BarChart3 size={15} className="text-[var(--neon-pink)]" /> {totalReviewsCount}+ total reviews
            </p>
          </div>

          {/* Vertical Bar Graph Breakdown */}
          <div className="flex-1 w-full max-w-md bg-black/20 rounded-2xl p-5 border border-white/5">
            <div className="flex justify-between items-end h-40 gap-3 pt-6 px-2">
              {distribution.map((d, i) => {
                const isSelected = filter === d.star;
                const isDimmed = filter !== null && !isSelected;
                return (
                  <button
                    key={d.star}
                    onClick={() => setFilter(isSelected ? null : d.star)}
                    className={`flex-1 flex flex-col items-center h-full justify-end group transition-opacity cursor-pointer ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                    title={`${d.star} Stars: ${d.count} reviews`}
                  >
                    {/* Count tooltip on hover */}
                    <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-semibold">
                      {d.count}
                    </span>
                    
                    {/* Bar Column */}
                    <div className="w-full bg-white/5 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${
                          isSelected 
                            ? 'bg-[var(--neon-pink)] shadow-[0_0_15px_var(--neon-pink)]' 
                            : 'bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-pink)] group-hover:brightness-125'
                        }`}
                        style={{
                          height: animateGraph ? `${d.heightPct}%` : '0%',
                          transitionDelay: `${i * 100}ms`
                        }}
                      />
                    </div>

                    {/* Star Label */}
                    <span className={`text-xs mt-2 font-medium transition-colors ${isSelected ? 'text-[var(--neon-pink)] font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                      {d.star}★
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="text-center border-t border-white/10 mt-3 pt-2 text-[11px] text-gray-400">
              Click a bar to filter rating
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="flex flex-col gap-3 shrink-0 bg-black/20 p-4 rounded-2xl border border-white/5 min-w-[200px]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Platforms</span>
            {['Google', 'Trustpilot', 'Website'].map((src) => {
              const Icon = SOURCE_META[src]?.icon ?? BadgeCheck;
              const count = sourceCounts[src as keyof typeof sourceCounts];
              return (
                <div key={src} className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={SOURCE_META[src]?.color ?? 'text-gray-400'} />
                    <span className="text-gray-300 text-xs">{src === 'Website' ? 'Verified Buyer' : src}</span>
                  </div>
                  <span className="text-white font-semibold text-xs bg-white/10 px-2 py-0.5 rounded-full">{count}+</span>
                </div>
              );
            })}
          </div>

        </div>

        {filter && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-sm animate-fade-in">
            <span className="text-gray-300">Showing reviews filtered by <strong className="text-white">{filter} Stars</strong></span>
            <button onClick={() => setFilter(null)} className="text-[var(--neon-pink)] hover:underline font-medium text-xs">
              Clear filter
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 rounded-2xl animate-shimmer" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((r, i) => <ReviewCard key={r.id} r={r} index={i} />)}
        </div>
      )}

      {/* Start Design CTA Button placed right after the reviews list / before footer */}
      <div className="mt-16 text-center bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.05] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-pink)]/5 via-transparent to-[var(--neon-purple)]/5 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Bring Your Vision to Life?</h3>
          <p className="text-gray-400 text-sm mb-6">Create your custom LED neon sign in minutes with our interactive live customizer.</p>
          <button
            onClick={() => navigate('/customiser')}
            className="group bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold py-4 px-10 rounded-xl hover:opacity-90 transition-all duration-300 shadow-xl shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
          >
            Start Designing Your Neon <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}