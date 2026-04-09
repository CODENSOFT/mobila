"use client";

import { Store, Truck, Zap } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

const METHODS = [
  {
    id: "standard",
    label: "Livrare standard",
    desc: "3-5 zile lucrătoare",
    price: "GRATUIT",
    icon: Truck,
  },
  {
    id: "express",
    label: "Livrare express",
    desc: "1-2 zile lucrătoare",
    price: "50 MDL",
    icon: Zap,
  },
  {
    id: "showroom",
    label: "Ridicare din showroom",
    desc: "Chișinău, bd. Ștefan cel Mare 64",
    price: "GRATUIT",
    icon: Store,
  },
] as const;

export default function DeliveryMethodSelect() {
  const { register, watch } = useFormContext<CheckoutFormValues>();
  const selected = watch("metodaLivrare");

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Metodă de livrare</h2>
      <div className="space-y-2">
        {METHODS.map((method) => {
          const Icon = method.icon;
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
