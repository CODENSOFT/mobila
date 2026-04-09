"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";

import CartItem from "@/src/components/cart/CartItem";
import { useCart } from "@/src/context/CartContext";

function transportCost(subtotal: number) {
  return subtotal > 500 ? 0 : 50;
}

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPret,
    isOpen,
    actualizeazaCantitate,
    scoateDinCos,
    inchideCos,
  } = useCart();

  const transport = transportCost(totalPret);
  const finalTotal = totalPret + transport;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        inchideCos();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, inchideCos]);

  return (
    <>
      <div
        className={`fixed inset-0 z-60 bg-black/45 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={inchideCos}
        aria-hidden
      />

      <aside
        className={`fixed right-0 top-0 z-70 flex h-full w-[420px] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Coșul meu"
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            Coșul meu ({totalItems} produse)
          </h2>
          <button
            type="button"
            onClick={inchideCos}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Închide coșul"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="text-base font-medium text-gray-700">Coșul tău este gol</p>
              <p className="mt-2 text-sm text-gray-500">Adaugă produse pentru a începe comanda.</p>
              <Link
                href="/produse"
                onClick={inchideCos}
                className="mt-6 rounded-lg bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
              >
                Descoperă produsele
              </Link>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onChangeQty={(cantitate) => actualizeazaCantitate(item.id, cantitate)}
                  onRemove={() => scoateDinCos(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-gray-100 px-5 pb-5 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{totalPret.toLocaleString()} MDL</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Transport</span>
              <span>{transport === 0 ? "Gratuit" : `${transport.toLocaleString()} MDL`}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-base font-semibold text-[#1a1a1a]">
              <span>Total</span>
              <span>{finalTotal.toLocaleString()} MDL</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#333]"
          >
            Finalizează comanda
          </Link>

          <button
            type="button"
            onClick={inchideCos}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Continuă cumpărăturile
          </button>
        </footer>
      </aside>
    </>
  );
}
