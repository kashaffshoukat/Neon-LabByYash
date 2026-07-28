import { useEffect, useRef, type ReactNode } from 'react';

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === 'undefined') return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  return observer;
}

export function useRevealAuto() {
  useEffect(() => {
    const obs = getObserver();
    if (!obs) return;
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    els.forEach((el) => obs.observe(el));
    return () => {
      els.forEach((el) => obs.unobserve(el));
    };
  }, []);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
};

export function Reveal({ children, className = '', variant = 'up', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = getObserver();
    if (!obs || !ref.current) return;
    obs.observe(ref.current);
    return () => {
      if (ref.current) obs.unobserve(ref.current);
    };
  }, []);

  const variantClass =
    variant === 'left' ? 'reveal-left' : variant === 'right' ? 'reveal-right' : variant === 'scale' ? 'reveal-scale' : 'reveal';

  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${variantClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
