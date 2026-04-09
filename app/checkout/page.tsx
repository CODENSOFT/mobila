"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DeliveryAddressForm from "@/src/components/checkout/DeliveryAddressForm";
import DeliveryMethodSelect from "@/src/components/checkout/DeliveryMethodSelect";
import DiscountCodeInput from "@/src/components/checkout/DiscountCodeInput";
import OrderSummaryPanel from "@/src/components/checkout/OrderSummaryPanel";
import PersonalDataForm from "@/src/components/checkout/PersonalDataForm";
import { useCart } from "@/src/context/CartContext";
import { toApiUrl } from "@/src/lib/api";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/src/lib/validations/checkoutSchema";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPret, golesteCosul } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountCode, setDiscountCode] = useState("");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      metodaLivrare: "standard",
      metodaPlata: "ramburs",
      gdprAccept: false,
      newsletter: false,
      codReducere: "",
      nota: "",
    },
  });

  const metodaLivrare = form.watch("metodaLivrare");
  const transport = metodaLivrare === "express" ? 50 : 0;
  const discountValue = Math.round((totalPret * discountPercent) / 100);
  const total = totalPret + transport - discountValue;

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/produse");
    }
  }, [items.length, router]);

  const breadcrumb = useMemo(
    () => [
      { label: "Coș", href: "/cos" },
      { label: "Detalii", href: "/checkout", active: true },
      { label: "Confirmare", href: "#", disabled: true },
    ],
    []
  );

  const onSubmit = form.handleSubmit(async (values) => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(toApiUrl("/api/comenzi"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            prenume: values.prenume,
            nume: values.nume,
            email: values.email,
            telefon: values.telefon,
            strada: values.strada,
            numar: values.numar,
            oras: values.oras,
            judet: values.raion,
            codPostal: values.codPostal,
          },
          produse: items,
          subtotal: totalPret,
          transport,
          reducere: discountValue,
          total,
          codReducere: discountCode || values.codReducere,
          metodaPlata: values.metodaPlata,
          metodaLivrare: values.metodaLivrare,
          nota: values.nota,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; id?: string; message?: string }
        | null;

      if (!response.ok || !data?.id) {
        throw new Error(
          data?.message ?? "A apărut o eroare. Te rugăm să încerci din nou."
        );
      }

      golesteCosul();
      router.push(
        `/checkout/confirmare?id=${encodeURIComponent(data.id)}&email=${encodeURIComponent(
          values.email
        )}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <main className="bg-gray-50 px-4 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1400px]">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={item.label} className="flex items-center gap-2">
              {index > 0 ? <span>→</span> : null}
              {item.active || item.disabled ? (
                <span className={item.active ? "font-medium text-[#1a1a1a]" : ""}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#1a1a1a]">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen((v) => !v)}
            className="inline-flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 text-left shadow-sm"
          >
            <span className="text-sm font-medium text-[#1a1a1a]">
              Sumar comandă ({items.length} produse)
            </span>
            {mobileSummaryOpen ? (
              <ChevronUp className="h-4 w-4" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden />
            )}
          </button>
          {mobileSummaryOpen ? (
            <div className="mt-3">
              <OrderSummaryPanel
                items={items}
                subtotal={totalPret}
                transport={transport}
                discountValue={discountValue}
                discountCode={discountCode}
                total={total}
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-4 lg:col-span-7">
              <PersonalDataForm />
              <DeliveryAddressForm />
              <DeliveryMethodSelect />
              <DiscountCodeInput
                onApplied={({ code, procent }) => {
                  setDiscountCode(code);
                  setDiscountPercent(procent);
                }}
              />

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-[#1a1a1a]">Notă comandă</h2>
                <textarea
                  {...form.register("nota")}
                  rows={4}
                  placeholder="Ex: Sună înainte de livrare, etaj 3 fără lift"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                />
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" {...form.register("gdprAccept")} className="mt-0.5 h-4 w-4" />
                  <span>
                    Am citit și accept Termenii și condițiile și Politica de confidențialitate
                  </span>
                </label>
                {form.formState.errors.gdprAccept ? (
                  <p className="mt-1 text-xs text-red-500">
                    {form.formState.errors.gdprAccept.message}
                  </p>
                ) : null}

                <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" {...form.register("newsletter")} className="mt-0.5 h-4 w-4" />
                  <span>Doresc să primesc oferte și noutăți pe email</span>
                </label>
              </section>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Se procesează...
                  </span>
                ) : (
                  <>
                    Plasează comanda
                    <span className="inline-flex items-center gap-1 text-xs text-white/80">
                      <Lock className="h-3.5 w-3.5" aria-hidden /> SSL
                    </span>
                  </>
                )}
              </button>
            </form>
          </FormProvider>

          <aside className="hidden lg:col-span-5 lg:block">
            <OrderSummaryPanel
              items={items}
              subtotal={totalPret}
              transport={transport}
              discountValue={discountValue}
              discountCode={discountCode}
              total={total}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
