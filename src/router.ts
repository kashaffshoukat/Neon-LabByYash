import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'collections' }
  | { name: 'collection'; slug: string }
  | { name: 'product'; slug: string }
  | { name: 'design'; id: string }
  | { name: 'customiser' }
  | { name: 'faq' }
  | { name: 'reviews' }
  | { name: 'logo-upload' }
  | { name: 'more-designs' }
  | { name: 'checkout' }
  | { name: 'cart' }
  | { name: 'privacy-policy' }
  | { name: 'terms-of-service' }
  | { name: 'refund-policy' };

export function parsePath(path: string): Route {
  const p = path.replace(/^#/, '').split('?')[0] || '/';
  if (p === '/' || p === '') return { name: 'home' };
  if (p === '/collections') return { name: 'collections' };
  if (p.startsWith('/collections/')) return { name: 'collection', slug: p.split('/')[2] };
  if (p.startsWith('/products/')) return { name: 'product', slug: p.split('/')[2] };
if (p.startsWith('/designs/')) return { name: 'design', id: p.split('/')[2] };
  if (p === '/customiser' || p === '/products/neon-sign-customiser') return { name: 'customiser' };
  if (p === '/faq') return { name: 'faq' };
  if (p === '/reviews') return { name: 'reviews' };
  if (p === '/logo-upload') return { name: 'logo-upload' };
  if (p === '/more-designs') return { name: 'more-designs' };
  if (p === '/checkout') return { name: 'checkout' };
  if (p === '/cart') return { name: 'cart' };
  if (p === '/privacy-policy') return { name: 'privacy-policy' };
  if (p === '/terms-of-service') return { name: 'terms-of-service' };
  if (p === '/refund-policy') return { name: 'refund-policy' };
  return { name: 'home' };
}

export function navigate(path: string) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(parsePath(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}
