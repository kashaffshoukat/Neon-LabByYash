import { useEffect } from 'react';
import { FileText, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { navigate } from '../router';

export function TermsOfServicePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      body: 'By accessing and using the Neon Lab by Yash website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.',
    },
    {
      icon: CreditCard,
      title: 'Orders & Payment',
      body: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment is processed securely through Stripe. Prices are displayed in British Pounds (£) and include applicable taxes where noted. A flat delivery charge of £19.90 applies to each product.',
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      body: 'We aim to dispatch custom neon signs within 7-10 working days for standard production, 4-6 working days for express, and 2-3 working days for rush orders. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers.',
    },
    {
      icon: ShieldCheck,
      title: 'Warranty & Liability',
      body: 'All our LED neon signs come with a 12-month warranty covering manufacturing defects. This does not cover damage caused by improper use, modification, or normal wear and tear. Our liability is limited to the purchase price of the product.',
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="gradient-line" style={{ top: 80 }} />
      <div className="text-center mb-12 animate-fade-in-down">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mx-auto mb-5">
          <FileText size={32} className="text-[var(--neon-pink)]" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white">Terms of Service</h1>
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
