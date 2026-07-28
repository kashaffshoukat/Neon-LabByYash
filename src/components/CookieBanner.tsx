import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = !!localStorage.getItem('cookie-consent'); } catch { /* ignore */ }
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem('cookie-consent', 'accepted'); } catch { /* ignore */ }
    setVisible(false);
  };

  const handleReject = () => {
    try { localStorage.setItem('cookie-consent', 'rejected'); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm animate-cookie-slide">
      <div className="relative bg-[#12121a] rounded-2xl border border-white/15 shadow-2xl p-5 overflow-hidden">
        <div className="rgb-gradient-line rgb-gradient-line-top" />
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <Cookie size={20} className="text-[var(--neon-pink)]" />
          <h3 className="text-white font-semibold text-sm tracking-wide">Cookies & Privacy</h3>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          We use cookies to enhance your browsing experience, serve personalised content, and analyse our traffic.
          By clicking "Accept All", you consent to our use of cookies.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-purple)] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Check size={14} /> Accept All
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-white/5 border border-white/15 text-gray-300 text-xs font-semibold py-2.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
}
