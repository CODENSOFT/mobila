"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  nume: string;
  pret: number;
  pretVechi?: number;
  imagine: string;
  cantitate: number;
  slug: string;
};

type CartToastItem = {
  id: string;
  mesaj: string;
};

export type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPret: number;
  isOpen: boolean;
  toasts: CartToastItem[];
  adaugaInCos: (produs: Omit<CartItem, "cantitate">) => void;
  scoateDinCos: (id: string) => void;
  actualizeazaCantitate: (id: string, cantitate: number) => void;
  golesteCosul: () => void;
  deschideCos: () => void;
  inchideCos: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "mobila-site-cart";

function clampQty(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.min(99, Math.max(1, value));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<CartToastItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) {
        setHydrated(true);
        return;
      }
      const safeItems = parsed
        .filter((item) => item && typeof item.id === "string")
        .map((item) => ({
          ...item,
          cantitate: clampQty(Number(item.cantitate ?? 1)),
        }));
      setItems(safeItems);
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const pushToast = useCallback((mesaj: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, mesaj }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const adaugaInCos = useCallback(
    (produs: Omit<CartItem, "cantitate">) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === produs.id);
        if (existing) {
          return prev.map((item) =>
            item.id === produs.id
              ? { ...item, cantitate: clampQty(item.cantitate + 1) }
              : item
          );
        }
        return [...prev, { ...produs, cantitate: 1 }];
      });
      pushToast(`${produs.nume} adăugat în coș`);
    },
    [pushToast]
  );

  const scoateDinCos = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const actualizeazaCantitate = useCallback((id: string, cantitate: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantitate: clampQty(cantitate) }
          : item
      )
    );
  }, []);

  const golesteCosul = useCallback(() => {
    setItems([]);
  }, []);

  const deschideCos = useCallback(() => setIsOpen(true), []);
  const inchideCos = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.cantitate, 0),
    [items]
  );
  const totalPret = useMemo(
    () => items.reduce((sum, item) => sum + item.pret * item.cantitate, 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      totalItems,
      totalPret,
      isOpen,
      toasts,
      adaugaInCos,
      scoateDinCos,
      actualizeazaCantitate,
      golesteCosul,
      deschideCos,
      inchideCos,
    }),
    [
      items,
      totalItems,
      totalPret,
      isOpen,
      toasts,
      adaugaInCos,
      scoateDinCos,
      actualizeazaCantitate,
      golesteCosul,
      deschideCos,
      inchideCos,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart trebuie folosit în interiorul CartProvider.");
  }
  return context;
}
