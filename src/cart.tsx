import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from './types';

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

type WishlistContextType = {
  items: CartItem[];
  toggle: (item: CartItem) => void;
  has: (id: string | number) => boolean;
  remove: (id: string | number) => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'neon-cart';
const WISHLIST_KEY = 'neon-wishlist';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setItems(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const add: CartContextType['add'] = (item) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.variant === item.variant);
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
    setOpen(true);
  };

  const remove: CartContextType['remove'] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const updateQty: CartContextType['updateQty'] = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );

  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count, isOpen, setOpen }}>
      <WishlistProvider>{children}</WishlistProvider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const toggle: WishlistContextType['toggle'] = (item) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        return prev.filter((p) => p.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const has: WishlistContextType['has'] = (id) => items.some((p) => String(p.id) === String(id));

  const remove: WishlistContextType['remove'] = (id) =>
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, has, remove, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within CartProvider');
  return ctx;
}
