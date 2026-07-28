import { useState, useRef, useCallback } from 'react';
import { Upload, ArrowRight, Check, X, FileImage, Loader2, PenTool, Clock, MessageSquare, Tag, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { supabase, formatPrice, NEON_COLORS, NEON_SIZES, NEON_MOUNTING } from '../lib';
import { useCart } from '../cart';
import { navigate } from '../router';
import { SectionDivider } from '../components/SectionDivider';

type UploadedFile = {
  file: File;
  previewUrl: string;
  storagePath: string;
  publicUrl: string;
};

const STEPS = [
  { num: 1, title: 'Upload Your Logo', desc: 'Fill out the form below with your design or logo image' },
  { num: 2, title: 'Get Your Quote', desc: "We'll send you a free design draft and price within 1-2 days" },
  { num: 3, title: 'Approve & Create', desc: 'Once approved, your custom neon sign will be handcrafted' },
];

const BENEFITS = [
  { icon: PenTool, label: 'Free Design Draft' },
  { icon: Clock, label: 'Quote within 24hrs' },
  { icon: MessageSquare, label: 'Personal Consultation' },
  { icon: Tag, label: 'Best Price Guaranteed' },
];

const BRANDS = ['Lipton', 'Dove', 'Vodafone', 'Nivea', 'Shell', 'Coca-Cola', 'TikTok', 'Dyson', "L'Oreal", 'Netflix', 'Amazon', 'JD Sports'];

export function LogoUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [email, setEmail] = useState('');
  const [signName, setSignName] = useState('');
  const [widthCm, setWidthCm] = useState<number | ''>('');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [color, setColor] = useState<string>('');
  const [mounting, setMounting] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { add, setOpen } = useCart();

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter((f) =>
      ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'application/pdf'].includes(f.type) ||
      /\.(png|jpe?g|svg|pdf|ai|webp)$/i.test(f.name)
    );

    if (arr.length === 0) {
      setError('Please upload a valid image file (PNG, JPG, SVG, PDF, or AI)');
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const uploaded: UploadedFile[] = [];
      for (const file of arr) {
        const ext = file.name.split('.').pop() || 'png';
        const storagePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('logo-uploads')
          .upload(storagePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('logo-uploads')
          .getPublicUrl(storagePath);

        uploaded.push({
          file,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          storagePath,
          publicUrl: urlData.publicUrl,
        });
      }
      setFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const f = prev[idx];
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please upload at least one image or logo file.');
      return;
    }
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('sign_name', signName || '');
      formData.append('width_cm', String(widthCm || ''));
      formData.append('height_cm', String(heightCm || ''));
      formData.append('color', color || '');
      formData.append('mounting', mounting || '');
      formData.append('notes', notes || '');
      for (const f of files) {
        formData.append('file_name', f.file.name);
        formData.append('file_url', f.publicUrl || '');
      }
      formData.append('_subject', 'New Logo Upload Quote Request');

      const formspreeRes = await fetch('https://formspree.io/f/mjgnbpve', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!formspreeRes.ok) throw new Error('Failed to submit notification.');

      for (const f of files) {
        const { error: insertError } = await supabase.from('logo_uploads').insert({
          email,
          file_path: f.storagePath,
          file_name: f.file.name,
          file_url: f.publicUrl,
          sign_name: signName || null,
          width_cm: widthCm || null,
          height_cm: heightCm || null,
          color: color || null,
          mounting: mounting || null,
          notes: notes || null,
          status: 'pending',
        });
        if (insertError) throw new Error(`Failed to submit: ${insertError.message}`);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCartAndCheckout = () => {
    const basePrice = 9900;
    const sizeAdd = NEON_SIZES.find((s) => s.name === 'Large')?.priceAdd ?? 6000;
    const mountAdd = NEON_MOUNTING.find((m) => m.name === mounting)?.priceAdd ?? 0;
    const total = basePrice + sizeAdd + mountAdd;

    add({
      id: `logo-quote-${Date.now()}`,
      name: `Custom Neon from Logo${signName ? `: "${signName}"` : ''}`,
      price: total,
      image_url: files[0]?.previewUrl || files[0]?.publicUrl || null,
      quantity: 1,
      variant: `${color || 'As quoted'} / ${widthCm || 'TBD'}×${heightCm || 'TBD'}cm / ${mounting || 'Wall Mount'}`,
    });

    navigate('/checkout');
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 animate-fade-in">
        <div className="bg-[#0f0b1e]/80 backdrop-blur-xl rounded-3xl p-10 border border-white/15 text-center shadow-[0_0_50px_rgba(255,42,109,0.15)]">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Request Submitted!</h2>
          <p className="text-gray-300 mt-4 leading-relaxed max-w-md mx-auto font-light text-sm sm:text-base">
            We've received your logo and details. Our design team will send a free design draft and
            quote to <span className="text-white font-medium">{email}</span> within 1-2 business days.
            Please check your spam folder if you don't hear from us.
          </p>

          <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 text-left">
            <h3 className="text-white font-semibold text-sm mb-3">Want to proceed now with a deposit?</h3>
            <p className="text-gray-300 text-sm mb-4 font-light">
              You can add a standard custom sign to your cart now and check out. We'll refine the design
              after you approve the mockup.
            </p>
            <button
              onClick={handleAddToCartAndCheckout}
              className="w-full bg-[var(--neon-pink)] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[var(--neon-pink)]/30 cursor-pointer"
            >
              <ShoppingBag size={18} /> Add to Cart & Checkout — {formatPrice(15900)}
            </button>
          </div>

          <button onClick={() => navigate('/')} className="mt-6 text-[var(--neon-pink)] font-semibold hover:underline cursor-pointer">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Thin white gradient border line */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0a0a0f] to-[#0a1a2e]" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[120px] rgb-blob animate-pulse" style={{ background: 'var(--neon-pink)', opacity: 0.22 }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[120px] rgb-blob-2" style={{ background: 'var(--neon-blue)', opacity: 0.18 }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[90px] rgb-blob-3" style={{ background: 'var(--neon-purple)', opacity: 0.15 }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight animate-fade-in-down">
            Logo & Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-blue)]">Upload</span>
          </h1>
          <p className="text-gray-300 mt-5 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg font-light animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Use this form to upload an image for a free quote. Once we've received your form, we'll have
            your design drawn and priced up within two working days. Please keep an eye on your email
            (including your spam).
          </p>
        </div>
      </section>
<SectionDivider/>
      {/* FREE QUOTE BENEFITS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--neon-pink)]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-12 relative z-10 animate-fade-in-down">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Free Quote & Design Interpretation</h2>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base font-light">
            Receive a fast and free quote within one business day or sooner. Including a neon design
            interpretation first draft and complementary personal consultation on any design or logo,
            large or small! Or call our Bespoke Team directly to discuss your requirements on{' '}
            <span className="text-white font-semibold">+44 7301288315</span>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {BENEFITS.map((b, i) => (
            <div 
              key={i} 
              className="group relative bg-[#0f0b1e]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[var(--neon-pink)]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(255,42,109,0.2)] text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--neon-pink)]/30 transition-colors pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-purple)]/20 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-[var(--neon-pink)]/50 transition-all duration-300">
                <b.icon size={26} className="text-[var(--neon-pink)] group-hover:text-white transition-colors" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base tracking-wide">{b.label}</span>
            </div>
          ))}
        </div>
      </section>
<SectionDivider/>
      {/* STEPS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <div 
              key={step.num} 
              className="group bg-[#0f0b1e]/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center flex flex-col items-center animate-fade-in-up hover:border-white/20 transition-all"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)] to-[var(--neon-purple)] text-white font-bold text-lg flex items-center justify-center mb-4 shadow-lg shadow-[var(--neon-pink)]/30 group-hover:scale-110 transition-transform">
                {step.num}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
<SectionDivider/>
      {/* UPLOAD FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-[#0f0b1e]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/15 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Drop zone */}
          <div>
            <label className="block text-white font-semibold mb-3">Upload Your Logo or Design *</label>
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-10 px-4 cursor-pointer transition-all duration-300 ${
                dragActive ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/10 shadow-[0_0_20px_rgba(255,42,109,0.2)]' : 'border-white/20 hover:border-[var(--neon-pink)]/60 bg-white/[0.02]'
              }`}
            >
              {uploading ? (
                <Loader2 size={36} className="text-[var(--neon-pink)] animate-spin mb-3" />
              ) : (
                <Upload size={36} className="text-[var(--neon-pink)] mb-3 animate-bounce" />
              )}
              <span className="text-white font-medium text-sm sm:text-base text-center">
                {uploading ? 'Uploading...' : 'Drag & drop your files here, or click to browse'}
              </span>
              <span className="text-gray-400 text-xs mt-1.5 font-light">PNG, JPG, SVG, PDF, AI, WEBP — up to 10 files</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.webp"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
              />
            </div>
          </div>

          {/* File previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
              {files.map((f, i) => (
                <div key={i} className="relative group bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-md">
                  {f.previewUrl ? (
                    <img src={f.previewUrl} alt={f.file.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-white/5">
                      <FileImage size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="p-2.5">
                    <p className="text-white text-xs truncate font-medium">{f.file.name}</p>
                    <p className="text-gray-400 text-[10px]">{(f.file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-sm sm:text-base"
            />
          </div>

          {/* Sign name */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Sign Name / Text (optional)</label>
            <input
              type="text"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder='e.g. "Welcome" or your business name'
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-sm sm:text-base"
            />
          </div>

          {/* Dimension presets */}
          <div>
            <label className="block text-white font-semibold mb-3 text-sm sm:text-base">Dimensions (Width × Height)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {[
                { w: 20, h: 20 },
                { w: 40, h: 40 },
                { w: 20, h: 8 },
                { w: 50, h: 30 },
                { w: 60, h: 40 },
                { w: 80, h: 50 },
                { w: 100, h: 60 },
                { w: 120, h: 80 },
              ].map((size) => {
                const selected = widthCm === size.w && heightCm === size.h;
                return (
                  <button
                    key={`${size.w}x${size.h}`}
                    type="button"
                    onClick={() => { setWidthCm(size.w); setHeightCm(size.h); }}
                    className={`py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      selected
                        ? 'bg-[var(--neon-pink)]/20 border-[var(--neon-pink)] text-white shadow-md shadow-[var(--neon-pink)]/20'
                        : 'bg-white/5 border-white/15 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {size.w}×{size.h} cm
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-xs mb-1 font-light">Width (cm)</label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="e.g. 60"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-xs mb-1 font-light">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="e.g. 40"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Color + Mounting */}
          <div className="grid sm:grid-cols-1 gap-4">
           {/* Color Selection Swatches */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Colour {color && <span className="text-[var(--neon-pink)] font-normal text-xs ml-2">({color})</span>}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
              {NEON_COLORS.map((c) => {
                const isSelected = color === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--neon-pink)]/20 border-[var(--neon-pink)] shadow-[0_0_15px_rgba(255,42,109,0.3)] scale-105'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {/* Square Color Box */}
                    <div 
                      className={`w-10 h-10 rounded-lg shadow-inner border border-white/20 transition-transform group-hover:scale-105 flex items-center justify-center`}
                      style={{ 
                        background: c.hex || 'var(--neon-pink)',
                        boxShadow: isSelected ? `0 0 12px ${c.hex || '#ff2a6d'}` : 'none'
                      }}
                    >
                      {/* Optional checkmark or inner glow for selected state */}
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white shadow-md" />
                      )}
                    </div>
                    
                    {/* Color Name Label */}
                    <span className="text-[11px] text-gray-300 mt-2 font-light truncate max-w-full text-center">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Mounting</label>
              <select
                value={mounting}
                onChange={(e) => setMounting(e.target.value)}
                className="w-full bg-[#120c24] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--neon-pink)] transition-colors text-sm sm:text-base"
              >
                <option value="" className="bg-[#120c24]">Select mounting</option>
                {NEON_MOUNTING.map((m) => (
                  <option key={m.name} value={m.name} className="bg-[#120c24]">{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about your preferred size, colour, and any special requirements..."
              rows={4}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-pink)] resize-none transition-colors text-sm sm:text-base"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-[var(--neon-pink)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--neon-pink)]/30 hover:shadow-[var(--neon-pink)]/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-base"
          >
            {submitting ? (
              <><Loader2 size={20} className="animate-spin" /> Submitting...</>
            ) : (
              <>Get My Free Quote <ArrowRight size={18} /></>
            )}
          </button>

          <p className="text-gray-400 text-xs text-center font-light">
            By submitting, you agree to be contacted by our design team regarding your quote.
            We typically respond within 1-2 business days.
          </p>
        </form>
      </section>
      {/* CONTACT INFO */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Phone, label: 'Call Us', value: '+44 7301 288315' },
            { icon: Mail, label: 'Email Us', value: 'sabashoukat2149@gmail.com' },
            { icon: MapPin, label: 'Visit Us', value: 'London, United Kingdom' },
          ].map((c, i) => (
            <div 
              key={i} 
              className="group bg-[#0f0b1e]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-[var(--neon-pink)]/50 transition-all text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--neon-pink)]/10 border border-[var(--neon-pink)]/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <c.icon size={20} className="text-[var(--neon-pink)]" />
              </div>
              <p className="text-gray-400 text-xs font-light">{c.label}</p>
              <p className="text-white text-sm font-semibold mt-1">{c.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}