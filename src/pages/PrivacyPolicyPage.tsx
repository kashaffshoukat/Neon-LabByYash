import { useEffect } from 'react';
import { Shield, Lock, FileText, RefreshCw } from 'lucide-react';
import { navigate } from '../router';

export function PrivacyPolicyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      body: 'We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you place an order. We also automatically collect certain information about your device, including IP address, browser type, and usage data through cookies and similar technologies.',
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      body: 'We use your information to process and fulfil your orders, communicate with you about your purchases, provide customer support, send promotional materials (with your consent), improve our website and services, and comply with legal obligations.',
    },
    {
      icon: FileText,
      title: 'Information Sharing',
      body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting business, or servicing you — such as Stripe for payment processing and shipping carriers for delivery.',
    },
    {
      icon: RefreshCw,
      title: 'Data Retention',
      body: 'We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order information is typically retained for 7 years for tax and accounting purposes.',
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="gradient-line" style={{ top: 80 }} />
      <div className="text-center mb-12 animate-fade-in-down">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mx-auto mb-5">
          <Shield size={32} className="text-[var(--neon-pink)]" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white">Privacy Policy</h1>
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
