import { useState } from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { navigate } from '../router';

const LINKS = {
  Shop: [
    { label: 'Customiser', path: '/customiser' },
    { label: 'Collections', path: '/collections' },
    { label: 'Logo Upload', path: '/logo-upload' },
  ],
  Help: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Shipping Info', path: '/faq' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#080810] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src="/logo.png" alt="Neon Lab by Yash" className="h-12 w-auto object-contain mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium custom LED neon signs. Designed by you, crafted by us, shipped worldwide.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#/"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)] transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{heading}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-gray-400 text-sm hover:text-[var(--neon-pink)] transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Mail size={16} /> sabashoukat2149@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +44 7301 288315</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> London, United Kingdom</li>
            </ul>
            <div className="mt-6">
              <p className="text-gray-500 text-xs mb-2">Get £10 off your first order</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                try {
                  await fetch('https://formspree.io/f/mjgnbpve', { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
                  form.reset();
                  alert('Thanks for subscribing!');
                } catch { alert('Something went wrong. Please try again.'); }
              }} className="flex">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)]"
                />
                <button type="submit" className="bg-[var(--neon-pink)] text-white text-sm font-semibold px-4 rounded-r-lg hover:opacity-90 transition-opacity">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 Neon Lab by Yash. All Rights Reserved.</p>
          <div className="flex gap-4 text-gray-500 text-xs">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-[var(--neon-pink)] transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-service')} className="hover:text-[var(--neon-pink)] transition-colors">Terms of Service</button>
            <button onClick={() => navigate('/refund-policy')} className="hover:text-[var(--neon-pink)] transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
