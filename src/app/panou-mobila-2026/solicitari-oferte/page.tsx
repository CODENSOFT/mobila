"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone, Trash2, User } from "lucide-react";

import { toApiUrl } from "@/src/lib/api";

type Solicitare = {
  _id: string;
  nume: string;
  telefon: string;
  mesaj: string;
  status: "new" | "contacted" | "closed";
  sursa?: string;
  createdAt: string;
};

const STATUS_LABELS: Record<Solicitare["status"], string> = {
  new: "Nouă",
  contacted: "Contactat",
  closed: "Închisă",
};

export default function SolicitariOfertePage() {
  const [items, setItems] = useState<Solicitare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(toApiUrl("/api/panou-mobila-2026/solicitari"), { cache: "no-store" });
      if (!res.ok) throw new Error("Nu s-au putut încărca datele.");
      const data = (await res.json()) as Solicitare[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: Solicitare["status"]) => {
    const res = await fetch(toApiUrl(`/api/clienti/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      alert("Nu s-a putut actualiza statusul.");
      return;
    }
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Ștergi definitiv această solicitare?")) return;
    const res = await fetch(toApiUrl(`/api/clienti/${id}`), { method: "DELETE" });
    if (!res.ok) {
      alert("Ștergerea a eșuat.");
      return;
    }
    await load();
  };

  return (
    <main className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Solicitări de ofertă</h2>
        <p className="mt-1 text-sm text-slate-600">
          Mesaje trimise din pagina Contact — formularul „Solicită o ofertă”.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Se încarcă…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Nu există solicitări încă.</p>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((row) => (
              <article key={row._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      {new Date(row.createdAt).toLocaleString("ro-RO", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-slate-900">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                      {row.nume}
                    </p>
                    <a
                      href={`tel:${row.telefon.replace(/\s/g, "")}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {row.telefon}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(row._id)}
                    className="inline-flex rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    title="Șterge"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{row.mesaj}</p>

                <div className="mt-3">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      void updateStatus(row._id, e.target.value as Solicitare["status"])
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                  >
                    {(Object.keys(STATUS_LABELS) as Solicitare["status"][]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Nume</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Mesaj</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((row) => (
                <tr key={row._id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {new Date(row.createdAt).toLocaleString("ro-RO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                      <User className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                      {row.nume}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${row.telefon.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {row.telefon}
                    </a>
                  </td>
                  <td className="max-w-md px-4 py-3 text-slate-700">
                    <span className="line-clamp-4 whitespace-pre-wrap">{row.mesaj}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        void updateStatus(row._id, e.target.value as Solicitare["status"])
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                    >
                      {(Object.keys(STATUS_LABELS) as Solicitare["status"][]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void remove(row._id)}
                      className="inline-flex rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      title="Șterge"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </>
      )}

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <Mail className="h-3.5 w-3.5" aria-hidden />
        Surse: doar înregistrări din formularul de contact (inclusiv cele vechi, fără câmp sursă).
      </p>
    </main>
  );
}
