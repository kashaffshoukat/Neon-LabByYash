import { useState } from 'react';
import { ChevronDown, HelpCircle, Search, MessageCircle, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useReveal } from '../useReveal';
import { navigate } from '../router';

const FAQ_SECTIONS = [
  {
    title: 'Product Information',
    items: [
      { q: 'What is included with the product?', a: 'As standard your sign comes with a 12v plug and wall mounting screws. Other accessories can be added such as a dimmer.' },
      { q: 'What are your neon signs made from?', a: 'The "neon" light is made using Ultra Glow LED technology, giving the most realistic neon glow, night or day! The main structure is made from clear acrylic, ensuring durability and a seamless blend into the wall behind.' },
      { q: 'How bright are Neon Lab by Yash signs?', a: 'Bright enough to fill your room with a neon glow. The optional Remote dimmer is highly recommended — easily increase or decrease the brightness depending on your mood.' },
      { q: 'Does my sign come with a remote dimmer as standard?', a: 'Not as standard, but this can be added as an optional extra when choosing to add a Remote dimmer. This allows you to adjust brightness and turn your sign on/off remotely.' },
      { q: 'How long is the cable?', a: '2m (black) cable from the power adaptor.' },
      { q: 'What plug/power adaptor do the signs use?', a: 'The signs are run from a 12v plug.' },
      { q: 'Can your signs be used outdoors?', a: 'We can make signs splash proof, but not waterproof. They are great for occasional outside use, or outside use undercover.' },
      { q: 'Do you offer colour-changing neon signs?', a: 'Yes, we offer colour-changing neon signs with an RGB option that allows you to change colours and effects with a remote control.' },
    ],
  },
  {
    title: 'Ordering & Custom Designs',
    items: [
      { q: 'How do I order a custom neon sign?', a: 'Use our online Customiser tool to type your text, choose your font, colour, and size, then add to cart. For logo uploads, visit our Logo Upload page.' },
      { q: 'Can I upload my own logo or design?', a: 'Yes! Visit our Logo Upload page to send us your design. Our team will create a digital mockup for your approval before production.' },
      { q: 'What is the maximum text length?', a: 'Up to 30 characters per line. For longer text or multi-line designs, please contact us for a custom quote.' },
      { q: 'Can I see a preview before ordering?', a: 'Absolutely. The Customiser shows a live preview of your sign as you design it. For logo uploads, we send a digital mockup before production.' },
    ],
  },
  {
    title: 'Shipping & Returns',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery is 7-14 business days. Custom signs take 10-21 business days as they are made to order.' },
      { q: 'Do you ship worldwide?', a: 'Yes, we offer free worldwide shipping on orders over £75. For orders under £75, shipping is calculated at checkout.' },
      { q: 'What is your return policy?', a: 'As custom signs are made to order, they are non-returnable unless faulty. Pre-designed signs can be returned within 30 days in original condition.' },
    ],
  },
  {
    title: 'Warranty & Care',
    items: [
      { q: 'What warranty do you offer?', a: 'All our signs come with a 24-month warranty covering manufacturing defects. LED lifespan is rated at 50,000+ hours.' },
      { q: 'How do I clean my neon sign?', a: 'Use a soft dry cloth to gently wipe the acrylic surface. Do not use water or cleaning chemicals directly on the sign.' },
      { q: 'Are your signs energy efficient?', a: 'Yes. Our LED neon signs consume significantly less power than traditional glass neon — typically 12v and very low running costs.' },
    ],
  },
];

export function FaqPage() {
  useReveal();
  const [open, setOpen] = useState<string | null>(`${FAQ_SECTIONS[0].title}-0`);
  const [query, setQuery] = useState('');

  const filtered = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !query || item.q.toLowerCase().includes(query.toLowerCase()) || item.a.toLowerCase().includes(query.toLowerCase()),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Ambient RGB blobs for background depth */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'var(--neon-pink)', opacity: 0.06 }} />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[100px]" style={{ background: 'var(--neon-blue)', opacity: 0.05 }} />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 text-[var(--neon-pink)] text-xs font-semibold mb-4 animate-fade-in-down">
            <HelpCircle size={13} /> Help Center
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)]">Questions</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base lg:text-lg animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Everything you need to know about our neon signs, ordering, and delivery
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12 reveal-scale">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g. warranty, shipping, outdoor)..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)]/50 focus:bg-white/[0.06] transition-all shadow-inner text-sm lg:text-base"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/5 text-gray-400">
            <HelpCircle size={36} className="mx-auto mb-3 text-gray-600" />
            <p className="text-lg font-medium text-white">No questions match "{query}"</p>
            <p className="text-sm mt-1 text-gray-500">Try searching with a different keyword or contact our support team below.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((section, si) => (
              <div key={section.title} className="reveal" style={{ transitionDelay: `${si * 0.08}s` }}>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[var(--neon-pink)] to-[var(--neon-purple)]" />
                  {section.title}
                </h2>
                <div className="space-y-2.5">
                  {section.items.map((item, i) => {
                    const key = `${section.title}-${i}`;
                    const isOpen = open === key;
                    return (
                      <div 
                        key={i} 
                        className={`bg-white/[0.04] rounded-2xl border overflow-hidden transition-all duration-300 ${
                          isOpen 
                            ? 'border-[var(--neon-pink)]/40 shadow-[0_4px_30px_-10px_var(--neon-pink)] bg-white/[0.06]' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <button 
                          onClick={() => setOpen(isOpen ? null : key)} 
                          className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                        >
                          <span className="text-white font-semibold text-sm lg:text-base pr-4">{item.q}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[var(--neon-pink)]/20 text-[var(--neon-pink)]' : 'bg-white/5 text-gray-400'}`}>
                            <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                          <div className="overflow-hidden">
                            <p className="px-5 pb-5 text-gray-300 text-sm lg:text-base leading-relaxed border-t border-white/5 pt-3">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start Design CTA Box */}
        <div className="reveal mt-14 text-center bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.05] rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-pink)]/5 via-transparent to-[var(--neon-purple)]/5 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-semibold mb-3">
              <Sparkles size={12} /> Custom Creator
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">Ready to Build Your Custom Neon Sign?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Design your personal text, choose your favourite fonts and colors, and see an instant live preview right now.</p>
            <button
              onClick={() => navigate('/custom')}
              className="group bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold py-3.5 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer text-sm lg:text-base"
            >
              Start Designing Your Neon <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}