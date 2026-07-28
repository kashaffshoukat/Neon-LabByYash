import { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { navigate } from '../router';
import { MORE_DESIGNS } from '../designs';
import { DesignCard } from '../components/DesignCard';
import { SectionDivider } from '../components/SectionDivider';
import { useReveal } from '../useReveal';
export function MoreDesignsPage() {
  useReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

 return (
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 overflow-hidden animate-fade-in">
    {/* Ambient Background Glows for Eye-Popping Effect */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--neon-purple)]/15 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute top-1/3 right-10 w-80 h-80 bg-[var(--neon-pink)]/10 blur-[100px] rounded-full pointer-events-none" />

    {/* Back Navigation */}
    <button
      onClick={() => navigate('/')}
      className="group inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-8 transition-all hover:-translate-x-1 animate-fade-in"
    >
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[var(--neon-pink)] group-hover:bg-[var(--neon-pink)]/10 transition-colors">
        <ArrowLeft size={16} className="text-gray-300 group-hover:text-[var(--neon-pink)] transition-colors" />
      </div>
      <span>Back to Home</span>
    </button>

    {/* Header */}
    <div className="text-center mb-14 relative z-10">
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--neon-pink)]/15 border border-[var(--neon-pink)]/40 text-[var(--neon-pink)] text-xs font-bold tracking-wider uppercase mb-4 shadow-lg shadow-[var(--neon-pink)]/20 animate-fade-in-down">
        <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} /> More Designs Collection
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
        Explore Our Full <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)]">Collection</span>
      </h1>
      <p className="text-gray-300 mt-4 max-w-xl mx-auto text-base sm:text-lg font-light animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {MORE_DESIGNS.length} handcrafted neon designs — add your favourites to the cart
      </p>
    </div>

    <SectionDivider />
    <div className="my-8" />

    {/* Grid with Responsive Layout & Staggered Onload Animations */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
      {MORE_DESIGNS.map((d, i) => (
        <div 
          key={d.id} 
          className="animate-fade-in-up transition-all duration-300"
          style={{ animationDelay: `${Math.min(i * 75, 600)}ms` }}
        >
          <DesignCard design={d} index={i} />
        </div>
      ))}
    </div>
  <SectionDivider/>

    {/* Eye-Popping CTA Section */}
    <div className="relative mt-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a1a2e]/80 border border-white/15 backdrop-blur-xl text-center overflow-hidden shadow-[0_0_50px_rgba(255,42,109,0.15)] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Thin white gradient border lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--neon-pink)]/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Can't find what you're looking for?</h3>
        <p className="text-gray-300 mt-2 mb-8 text-sm sm:text-base font-light">Bring your own vision to life with our interactive 3D studio.</p>
        
        <button
          onClick={() => navigate('/customiser')}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 shadow-lg shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
          style={{ background: 'var(--neon-pink)' }}
        >
          <span>Design Your Own Sign</span> <Sparkles size={18} className="animate-pulse" />
        </button>
      </div>
    </div>
  <SectionDivider/>
  </div>
);}