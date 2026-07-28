import { useEffect } from 'react';
import { RefreshCw, Package, CreditCard, Mail } from 'lucide-react';
import { navigate } from '../router';

export function RefundPolicyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      icon: RefreshCw,
      title: 'Return & Refund Policy',
      body: 'Due to the custom-made nature of our LED neon signs, we do not accept returns or issue refunds for custom-designed products unless they arrive damaged or defective. Each sign is handcrafted to your exact specifications and cannot be resold.',
    },
    {
      icon: Package,
      title: 'Damaged or Defective Items',
      body: 'If your sign arrives damaged or with a manufacturing defect, please contact us within 7 days of delivery with photographic evidence. We will repair or replace the sign at no cost to you. If we are unable to repair or replace, a full refund will be issued.',
    },
    {
      icon: CreditCard,
      title: 'Refund Process',
      body: 'Approved refunds will be processed back to the original payment method within 5-10 working days. The time it takes for the refund to appear in your account depends on your bank or card issuer.',
    },
    {
      icon: Mail,
      title: 'How to Contact Us',
      body: 'To request a refund or report a damaged item, please email us at sabashoukat2149@gmail.com with your order number, a description of the issue, and photographs. You can also call us at +44 7301 288315.',
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="gradient-line" style={{ top: 80 }} />
      <div className="text-center mb-12 animate-fade-in-down">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mx-auto mb-5">
          <RefreshCw size={32} className="text-[var(--neon-pink)]" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white">Refund Policy</h1>
        <p className="text-gray-400 mt-3">Last updated: January 2026</p>
      </div>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div
            key={i}
className="bg-white/[0.04] rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-white/25 transition-colors"            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-pink)]/15 flex items-center justify-center">
                <s.icon size={20} className="text-[var(--neon-pink)]" />
              </div>
              <h2 className="text-xl font-bold text-white">{s.title}</h2>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button onClick={() => navigate('/')} className="text-[var(--neon-pink)] font-semibold hover:underline">
          Back to Home
        </button>
      </div>
    </div>
  );
}
