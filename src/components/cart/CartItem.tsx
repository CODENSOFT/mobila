"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/src/context/CartContext";

type CartItemProps = {
  item: CartItemType;
  onChangeQty: (cantitate: number) => void;
  onRemove: () => void;
};

export default function CartItem({ item, onChangeQty, onRemove }: CartItemProps) {
  return (
    <article className="flex gap-4 border-b border-gray-100 py-4">
      <Link
        href={`/produse/${item.slug || item.id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
      >
        <Image
          src={item.imagine}
          alt={item.nume}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-[#1a1a1a]">{item.nume}</h3>
        <p className="mt-1 text-sm text-gray-500">{item.pret.toLocaleString()} MDL / buc</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => onChangeQty(item.cantitate - 1)}
              disabled={item.cantitate <= 1}
              className="inline-flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Scade cantitatea"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="inline-flex min-w-9 items-center justify-center px-2 text-sm">
              {item.cantitate}
            </span>
            <button
              type="button"
              onClick={() => onChangeQty(item.cantitate + 1)}
              disabled={item.cantitate >= 99}
              className="inline-flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Crește cantitatea"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Șterge produsul"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
