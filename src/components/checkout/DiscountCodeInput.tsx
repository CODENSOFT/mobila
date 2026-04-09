"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { CheckoutFormValues } from "@/src/lib/validations/checkoutSchema";

type Props = {
  onApplied: (payload: { code: string; procent: number }) => void;
};

export default function DiscountCodeInput({ onApplied }: Props) {
  const { setValue, watch } = useFormContext<CheckoutFormValues>();
  const codReducere = watch("codReducere") ?? "";

  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const applyCode = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const response = await fetch("/api/reduceri/valideaza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cod: codReducere }),
      });
      const data = (await response.json()) as
        | { valid: true; procent: number; cod: string }
        | { valid: false; message: string };
      if (!response.ok || !data.valid) {
        setStatus("error");
        setMessage(
          "message" in data ? data.message : "Cod invalid. Încearcă din nou."
        );
        return;
      }
      setStatus("ok");
      setMessage(`Cod valid: -${data.procent}%`);
      setValue("codReducere", data.cod);
      onApplied({ code: data.cod, procent: data.procent });
    } catch {
      setStatus("error");
      setMessage("A apărut o eroare la validarea codului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-[#1a1a1a]">Cod de reducere</h2>
      <div className="flex gap-2">
        <input
          value={codReducere}
          onChange={(e) => setValue("codReducere", e.target.value)}
          placeholder="SAVE10"
          className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm"
        />
        <button
          type="button"
          onClick={() => void applyCode()}
          disabled={loading || !codReducere.trim()}
          className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          Aplică
        </button>
      </div>
      {status !== "idle" ? (
        <p className={`mt-2 text-sm ${status === "ok" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
