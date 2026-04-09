"use client";

import { Check } from "lucide-react";

import { useCart } from "@/src/context/CartContext";

export default function CartToast() {
  const { toasts } = useCart();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-80 flex w-full max-w-xs flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-2 rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm text-white shadow-lg"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden />
          <p className="line-clamp-2">{toast.mesaj}</p>
        </div>
      ))}
    </div>
  );
}
