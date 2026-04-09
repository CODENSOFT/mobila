"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/src/context/CartContext";

type CartIconProps = {
  className?: string;
};

export default function CartIcon({ className = "" }: CartIconProps) {
  const { totalItems, deschideCos } = useCart();
  const prevTotalRef = useRef(totalItems);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      const start = window.setTimeout(() => setPulse(true), 0);
      const stop = window.setTimeout(() => setPulse(false), 350);
      return () => {
        window.clearTimeout(start);
        window.clearTimeout(stop);
      };
    }
    prevTotalRef.current = totalItems;
    return undefined;
  }, [totalItems]);

  useEffect(() => {
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <button
      type="button"
      onClick={deschideCos}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 ${className}`}
      aria-label="Deschide coșul"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {totalItems > 0 ? (
        <span
          className={`absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[11px] font-semibold leading-none text-white ${
            pulse ? "animate-pulse" : ""
          }`}
        >
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
