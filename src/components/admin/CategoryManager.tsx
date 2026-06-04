"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUCT_CATEGORY_GROUPS } from "@/src/constants/categories";
import { fetchCustomCategories, type CustomCategory } from "@/src/lib/customCategories";

const GROUP_TITLES = PRODUCT_CATEGORY_GROUPS.map((g) => g.title);

export default function CategoryManager({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<CustomCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newGrup, setNewGrup] = useState<string>(GROUP_TITLES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editGrup, setEditGrup] = useState<string>(GROUP_TITLES[0]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchCustomCategories();
    // Show all (including hidden) so admin can restore them
    setItems(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const grouped = GROUP_TITLES.map((title) => ({
    title,
    items: items.filter((i) => i.grup === title),
  }));

  // Single unified API call: every admin action uses POST /api/categorii with { action, ... }
  const callApi = async (payload: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> => {
    try {
      console.info("[CategoryManager] →", payload);
      const res = await fetch("/api/categorii", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.info("[CategoryManager] ←", res.status, text);
      let data: { message?: string } | null = null;
      try {
        data = JSON.parse(text) as { message?: string };
      } catch {
        data = null;
      }
      if (!res.ok) {
        return { ok: false, message: `${res.status}: ${data?.message ?? text.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (err) {
      console.error("[CategoryManager] network error", err);
      return { ok: false, message: "Eroare la rețea." };
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const label = newLabel.trim();
    if (!label) {
      setError("Scrie denumirea categoriei.");
      return;
    }
    setBusy(true);
    const result = await callApi({ action: "create", key: label, label, grup: newGrup });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut crea categoria.");
      return;
    }
    setNewLabel("");
    await refresh();
    onChange?.();
  };

  const startEdit = (item: CustomCategory) => {
    setEditingId(item._id);
    setEditLabel(item.label);
    setEditGrup(item.grup);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
    setEditGrup(GROUP_TITLES[0]);
  };

  const saveEdit = async (item: CustomCategory) => {
    setError(null);
    const label = editLabel.trim();
    const grup = editGrup;
    if (!label || !grup) {
      setError("Eticheta și grupul sunt obligatorii.");
      return;
    }
    setBusy(true);
    const result = await callApi({ action: "update", id: item._id, label, grup });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut salva.");
      return;
    }
    cancelEdit();
    await refresh();
    onChange?.();
  };

  const handleDelete = async (item: CustomCategory) => {
    setDeletingId(item._id);
    setError(null);
    const result = await callApi({ action: "delete", id: item._id });
    setDeletingId(null);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut șterge.");
      return;
    }
    await refresh();
    onChange?.();
  };

  const handleRestore = async (item: CustomCategory) => {
    setDeletingId(item._id);
    setError(null);
    const result = await callApi({ action: "restore", id: item._id });
    setDeletingId(null);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut restaura.");
      return;
    }
    await refresh();
    onChange?.();
  };

  const handleResetAll = async () => {
    if (!confirm("Sigur vrei să resetezi TOATE categoriile la valorile implicite? Toate modificările (adăugări, ștergeri, redenumiri) vor fi pierdute.")) return;
    setBusy(true);
    setError(null);
    const result = await callApi({ action: "reset-all" });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Resetul a eșuat.");
      return;
    }
    await refresh();
    onChange?.();
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categorii</h2>
          <p className="mt-1 text-sm text-gray-500">
            Toate categoriile sunt stocate în baza de date și editabile. Modificările apar imediat în selectorul de produs și în filtrul de pe pagina /produse.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          disabled={busy}
          className="self-start rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          title="Șterge tot și revine la categoriile implicite"
        >
          ↻ Resetează la implicite
        </button>
      </header>

      <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Denumire nouă</span>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="ex: Birouri"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Grup</span>
          <select
            value={newGrup}
            onChange={(e) => setNewGrup(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {GROUP_TITLES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "..." : "+ Adaugă"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-400">Se încarcă...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400">Nicio categorie. Adaugă prima de mai sus.</p>
        ) : (
          grouped.map((g) =>
            g.items.length > 0 ? (
              <div key={g.title}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">{g.title}</p>
                <ul className="space-y-1.5">
                  {g.items.map((item) => {
                    const isEditing = editingId === item._id;
                    return (
                      <li
                        key={item._id}
                        className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        {isEditing ? (
                          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <select
                              value={editGrup}
                              onChange={(e) => setEditGrup(e.target.value)}
                              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              {GROUP_TITLES.map((g) => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => saveEdit(item)}
                                disabled={busy}
                                className="rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                              >
                                Salvează
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Anulează
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${item.hidden ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {item.label}
                              </span>
                              {item.hidden && (
                                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-rose-700">
                                  ascunsă
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              {item.hidden ? (
                                <button
                                  type="button"
                                  onClick={() => handleRestore(item)}
                                  disabled={deletingId === item._id}
                                  className="rounded-md border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                                >
                                  {deletingId === item._id ? "..." : "Restaurează"}
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEdit(item)}
                                    className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                  >
                                    Editează
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    disabled={deletingId === item._id}
                                    className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                                  >
                                    {deletingId === item._id ? "..." : "Șterge"}
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null
          )
        )}
      </div>
    </section>
  );
}
