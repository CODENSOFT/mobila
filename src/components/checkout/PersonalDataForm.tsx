"use client";

import { useFormContext } from "react-hook-form";

import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

export default function PersonalDataForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>();

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Date personale</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <input
            {...register("prenume")}
            placeholder="Prenume"
            className={`h-11 w-full rounded-lg border px-3 text-sm ${
              errors.prenume ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.prenume ? (
            <p className="mt-1 text-xs text-red-500">{errors.prenume.message}</p>
          ) : null}
        </div>
        <div>
          <input
            {...register("nume")}
            placeholder="Nume"
            className={`h-11 w-full rounded-lg border px-3 text-sm ${
              errors.nume ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.nume ? <p className="mt-1 text-xs text-red-500">{errors.nume.message}</p> : null}
        </div>
      </div>
      <div className="mt-3">
        <input
          {...register("email")}
          placeholder="Email"
          className={`h-11 w-full rounded-lg border px-3 text-sm ${
            errors.email ? "border-red-400" : "border-gray-200"
          }`}
        />
        {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
      </div>
      <div className="mt-3">
        <input
          {...register("telefon")}
          placeholder="+373xxxxxxxx"
          className={`h-11 w-full rounded-lg border px-3 text-sm ${
            errors.telefon ? "border-red-400" : "border-gray-200"
          }`}
        />
        {errors.telefon ? (
          <p className="mt-1 text-xs text-red-500">{errors.telefon.message}</p>
        ) : null}
      </div>
    </section>
  );
}
