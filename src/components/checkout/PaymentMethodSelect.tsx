"use client";

import { Banknote, CreditCard, Landmark } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

const METHODS = [
  {
    id: "card",
    label: "Plată cu cardul",
    desc: "Visa, Mastercard (securizat SSL)",
    icon: CreditCard,
  },
  {
    id: "ramburs",
    label: "Ramburs la livrare",
    desc: "Plătești când primești coletul",
    icon: Banknote,
  },
  {
    id: "transfer",
    label: "Transfer bancar",
    desc: "Datele contului după plasarea comenzii",
    icon: Landmark,
  },
] as const;

export default function PaymentMethodSelect() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();
  const selected = watch("metodaPlata");

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Metodă de plată</h2>
      <div className="space-y-2">
        {METHODS.map((method) => {
          const Icon = method.icon;
          const active = selected === method.id;
          return (
            <label
              key={method.id}
              className={`block cursor-pointer rounded-lg border p-4 ${
                active ? "border-2 border-[#1a1a1a] bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  value={method.id}
                  {...register("metodaPlata")}
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

              {selected === "card" && method.id === "card" ? (
                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    {...register("cardNumber")}
                    placeholder="Număr card"
                    className="h-10 rounded-lg border border-gray-200 px-3 text-sm md:col-span-2"
                  />
                  <input
                    {...register("cardTitular")}
                    placeholder="Titular"
                    className="h-10 rounded-lg border border-gray-200 px-3 text-sm md:col-span-2"
                  />
                  <input
                    {...register("cardExp")}
                    placeholder="MM/YY"
                    className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
                  />
                  <input
                    {...register("cardCvv")}
                    placeholder="CVV"
                    className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
                  />
                </div>
              ) : null}
            </label>
          );
        })}
      </div>
      {errors.metodaPlata ? (
        <p className="mt-2 text-xs text-red-500">{errors.metodaPlata.message}</p>
      ) : null}
    </section>
  );
}
