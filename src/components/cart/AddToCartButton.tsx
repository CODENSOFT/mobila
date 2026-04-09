"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/src/context/CartContext";
import type { CartItem } from "@/src/context/CartContext";

type AddToCartButtonProps = {
  produs: Omit<CartItem, "cantitate">;
  className?: string;
};

export default function AddToCartButton({
  produs,
  className = "",
}: AddToCartButtonProps) {
  const { adaugaInCos } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  const handleAdd = async () => {
    if (status !== "idle") return;
    setStatus("loading");

    await new Promise((resolve) => window.setTimeout(resolve, 500));
    adaugaInCos(produs);
    setStatus("added");

    window.setTimeout(() => {
      setStatus("idle");
    }, 2000);
  };

  const isDisabled = status === "added" || status === "loading";

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isDisabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
    >
      {status === "added" ? (
        <>
          <Check className="h-4 w-4 text-green-400" aria-hidden />
          <span className="animate-pulse">Adăugat!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" aria-hidden />
          <span>{status === "loading" ? "Se adaugă..." : "Adaugă în coș"}</span>
        </>
      )}
    </button>
  );
}
