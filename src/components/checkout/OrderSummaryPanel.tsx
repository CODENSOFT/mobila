"use client";

import Image from "next/image";

import type { CartItem } from "@/src/context/CartContext";

type Props = {
  items: CartItem[];
  subtotal: number;
  transport: number;
  discountValue: number;
  discountCode?: string;
  total: number;
};

export default function OrderSummaryPanel({
  items,
  subtotal,
  transport,
  discountValue,
  discountCode,
  total,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-8">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Sumar comandă ({items.length} produse)
      </h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image src={item.imagine} alt={item.nume} fill className="object-cover" sizes="64px" />
              <span className="absolute -right-1 -top-1 rounded-full bg-gray-800 px-1.5 py-0.5 text-[10px] text-white">
                x{item.cantitate}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-[#1a1a1a]">{item.nume}</p>
              <p className="mt-1 text-sm text-gray-600">
                {(item.pret * item.cantitate).toLocaleString()} MDL
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString()} MDL</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Transport</span>
          <span>{transport === 0 ? "Gratuit" : `${transport.toLocaleString()} MDL`}</span>
        </div>
        {discountValue > 0 ? (
          <div className="flex justify-between text-green-700">
            <span>Reducere ({discountCode})</span>
            <span>-{discountValue.toLocaleString()} MDL</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-lg font-bold text-[#1a1a1a]">
          <span>TOTAL</span>
          <span>{total.toLocaleString()} MDL</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">(inclusiv TVA 19%)</p>
      </div>
    </div>
  );
}
