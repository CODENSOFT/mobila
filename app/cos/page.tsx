"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import CartItem from "@/src/components/cart/CartItem";
import { useCart } from "@/src/context/CartContext";

function transportCost(subtotal: number) {
  return subtotal > 500 ? 0 : 50;
}

export default function CartPage() {
  const {
    items,
    totalPret,
    actualizeazaCantitate,
    scoateDinCos,
    golesteCosul,
  } = useCart();
  const [codReducere, setCodReducere] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = totalPret;
  const transport = transportCost(subtotal);
  const discountValue = useMemo(
    () => Math.round((subtotal * discountPercent) / 100),
    [subtotal, discountPercent]
  );
  const finalTotal = subtotal + transport - discountValue;

  const aplicaReducerea = () => {
    const code = codReducere.trim().toUpperCase();
    if (code === "LAB10") {
      setDiscountPercent(10);
      return;
    }
    setDiscountPercent(0);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#fafaf9] px-6 py-20 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-9 w-9 text-gray-400" aria-hidden />
          </div>
          <h1 className="text-3xl font-light text-[#1c1917]">Coșul tău este gol</h1>
          <p className="mt-2 text-sm text-gray-500">
            Nu ai produse adăugate momentan. Explorează colecția noastră.
          </p>
          <Link
            href="/produse"
            className="mt-8 rounded-lg bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333]"
          >
            Descoperă produsele
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fafaf9] px-6 py-10 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-8 text-3xl font-light text-[#1c1917] lg:text-4xl">Coșul meu</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {items.length} produse în coș
              </p>
              <button
                type="button"
                onClick={golesteCosul}
                className="text-sm text-red-600 transition-colors hover:text-red-700"
              >
                Golește coșul
              </button>
            </div>

            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <CartItem
                    item={item}
                    onChangeQty={(qty) => actualizeazaCantitate(item.id, qty)}
                    onRemove={() => scoateDinCos(item.id)}
                  />
                  <div className="flex justify-end pb-2 text-sm text-gray-600">
                    Total linie: {(item.pret * item.cantitate).toLocaleString()} MDL
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Sumar comandă</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal produse</span>
                <span>{subtotal.toLocaleString()} MDL</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Transport</span>
                <span>{transport === 0 ? "Gratuit" : `${transport.toLocaleString()} MDL`}</span>
              </div>
              {discountPercent > 0 ? (
                <div className="flex items-center justify-between text-green-700">
                  <span>Reducere ({discountPercent}%)</span>
                  <span>-{discountValue.toLocaleString()} MDL</span>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3">
              <label htmlFor="coupon" className="text-xs uppercase tracking-wide text-gray-500">
                Cod reducere
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="coupon"
                  value={codReducere}
                  onChange={(event) => setCodReducere(event.target.value)}
                  className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none ring-0 focus:border-gray-400"
                  placeholder="ex: LAB10"
                />
                <button
                  type="button"
                  onClick={aplicaReducerea}
                  className="h-10 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Aplică
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold text-[#1a1a1a]">
                <span>Total final</span>
                <span>{finalTotal.toLocaleString()} MDL</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#333]"
            >
              Finalizează comanda
            </Link>

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Acceptăm</p>
              <div className="flex items-center gap-2">
                {["Visa", "Mastercard", "PayPal"].map((method) => (
                  <div
                    key={method}
                    className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/produse"
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Continuă cumpărăturile
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
