"use client";

import { Store, Truck, Zap } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useLang } from "@/src/context/LangContext";
import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

const METHOD_ICONS = { standard: Truck, express: Zap, showroom: Store } as const;
type MethodId = keyof typeof METHOD_ICONS;

type DeliveryMethodSelectProps = {
  expressPrice: number;
};

export default function DeliveryMethodSelect({ expressPrice }: DeliveryMethodSelectProps) {
  const { register, watch } = useFormContext<CheckoutFormValues>();
  const { dict } = useLang();
  const t = dict.checkout;
  const selected = watch("metodaLivrare");

  const methods: { id: MethodId; label: string; desc: string; price: string }[] = [
    { id: "standard", label: t.delivery.standard.label, desc: t.delivery.standard.desc, price: t.free },
    { id: "express",  label: t.delivery.express.label,  desc: t.delivery.express.desc,  price: expressPrice <= 0 ? t.free : `${expressPrice} MDL` },
    { id: "showroom", label: t.delivery.showroom.label, desc: t.delivery.showroom.desc, price: t.free },
  ];

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">{t.deliveryMethod}</h2>
      <div className="space-y-2">
        {methods.map((method) => {
          const Icon = METHOD_ICONS[method.id];
          const active = selected === method.id;
          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-colors ${
                active ? "border-2 border-[#1a1a1a] bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex gap-3">
                <input
                  type="radio"
                  value={method.id}
                  {...register("metodaLivrare")}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="flex items-center gap-2 font-medium text-[#1a1a1a]">
                    <Icon className="h-4 w-4" aria-hidden />
                    {method.label}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{method.desc}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#1a1a1a]">{method.price}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
