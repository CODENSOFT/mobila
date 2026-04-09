"use client";

import { useFormContext } from "react-hook-form";

import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

export default function DeliveryAddressForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Adresa de livrare</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          {...register("strada")}
          placeholder="Strada"
          className={`h-11 rounded-lg border px-3 text-sm ${errors.strada ? "border-red-400" : "border-gray-200"}`}
        />
        <input
          {...register("numar")}
          placeholder="Număr"
          className={`h-11 rounded-lg border px-3 text-sm ${errors.numar ? "border-red-400" : "border-gray-200"}`}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input {...register("bloc")} placeholder="Bloc" className="h-11 rounded-lg border border-gray-200 px-3 text-sm" />
        <input {...register("scara")} placeholder="Scară" className="h-11 rounded-lg border border-gray-200 px-3 text-sm" />
        <input {...register("apartament")} placeholder="Apartament" className="h-11 rounded-lg border border-gray-200 px-3 text-sm" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          {...register("oras")}
          placeholder="Oraș"
          className={`h-11 rounded-lg border px-3 text-sm ${errors.oras ? "border-red-400" : "border-gray-200"}`}
        />
        <input
          {...register("raion")}
          placeholder="Raion / Municipiu"
          className={`h-11 rounded-lg border px-3 text-sm ${errors.raion ? "border-red-400" : "border-gray-200"}`}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          {...register("codPostal")}
          placeholder="Cod poștal (ex: MD-2001)"
          className={`h-11 rounded-lg border px-3 text-sm ${errors.codPostal ? "border-red-400" : "border-gray-200"}`}
        />
      </div>
    </section>
  );
}
