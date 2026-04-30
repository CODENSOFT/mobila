"use client";

import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import type { CartItem } from "@/src/context/CartContext";
import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { getSafeImageSrc } from "@/src/lib/image";

type Props = {
  items: CartItem[];
  subtotal: number;
  transport: number;
  discountValue: number;
  discountCode?: string;
  total: number;
};

function SummaryLineNume({ nume, lang }: { nume: string; lang: string }) {
  const { text } = useLiveRuText(nume, lang);
  return <>{text}</>;
}

export default function OrderSummaryPanel({
  items,
  subtotal,
  transport,
  discountValue,
  discountCode,
  total,
}: Props) {
  const { lang, dict } = useLang();
  const t = dict.checkout;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-8">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        {t.orderSummary} ({items.length})
      </h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={getSafeImageSrc(item.imagine)}
                alt={item.nume}
                fill
                className="object-cover"
                sizes="64px"
              />
              <span className="absolute -right-1 -top-1 rounded-full bg-gray-800 px-1.5 py-0.5 text-[10px] text-white">
                x{item.cantitate}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-[#1a1a1a]">
                <SummaryLineNume nume={item.nume} lang={lang} />
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {(item.pret * item.cantitate).toLocaleString()} MDL
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t.subtotal}</span>
          <span>{subtotal.toLocaleString()} MDL</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t.shipping}</span>
          <span>{transport === 0 ? t.free : `${transport.toLocaleString()} MDL`}</span>
        </div>
        {discountValue > 0 ? (
          <div className="flex justify-between text-green-700">
            <span>{t.discount} ({discountCode})</span>
            <span>-{discountValue.toLocaleString()} MDL</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-lg font-bold text-[#1a1a1a]">
          <span>{t.total}</span>
          <span>{total.toLocaleString()} MDL</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{t.vat}</p>
      </div>
    </div>
  );
}
