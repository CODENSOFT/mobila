"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PanouLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/panou-mobila-2026/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Parolă incorectă.");
        return;
      }
      router.push("/panou-mobila-2026");
      router.refresh();
    } catch {
      setError("Nu s-a putut conecta. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-slate-900">Autentificare panou</h1>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Parolă
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-400"
            required
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Se trimite…" : "Submit"}
        </button>
      </form>
    </main>
  );
}
