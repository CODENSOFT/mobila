"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCustomCategories, type CustomCategory } from "@/src/lib/customCategories";
import { fetchSections } from "@/src/lib/sections";

export default function CategoryManager({
  onChange,
  refreshSignal,
}: {
  onChange?: () => void;
  refreshSignal?: number;
}) {
  const [items, setItems] = useState<CustomCategory[]>([]);
  // Section titles, ordered — loaded live from /api/sectiuni so admin-created
  // sections immediately appear as group options here.
  const [groupTitles, setGroupTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newGrup, setNewGrup] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editGrup, setEditGrup] = useState<string>("");

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const [data, sections] = await Promise.all([fetchCustomCategories(), fetchSections()]);
    // After hard delete, hidden records shouldn't exist, but filter as safety
    setItems(data.filter((c) => !c.hidden));
    const titles = sections.filter((s) => !s.hidden).map((s) => s.title);
    setGroupTitles(titles);
    // Default the "new category" group to the first section once available.
    setNewGrup((prev) => (prev && titles.includes(prev) ? prev : titles[0] ?? ""));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, refreshSignal]);

  // Show every section in canonical order, plus any group still referenced by a
  // category but missing from the sections list (so nothing silently disappears).
  const orphanGroups = Array.from(
    new Set(items.map((i) => i.grup).filter((g) => g && !groupTitles.includes(g)))
  );
  const grouped = [...groupTitles, ...orphanGroups].map((title) => ({
    title,
    items: items
      .filter((i) => i.grup === title)
      .sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0)),
  }));

  // Single unified API call
  const callApi = async (payload: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/categorii", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
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
    setEditGrup(groupTitles[0] ?? "");
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
    // Optimistic remove
    setItems((prev) => prev.filter((it) => it._id !== item._id));
    const result = await callApi({ action: "delete", id: item._id });
    setDeletingId(null);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut șterge.");
      await refresh(); // rollback
      return;
    }
    onChange?.();
  };

  // ===== Drag & Drop =====
  const handleDragStart = (e: React.DragEvent, item: CustomCategory) => {
    setDraggedId(item._id);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", item._id); } catch {}
  };

  const handleDragOver = (e: React.DragEvent, item: CustomCategory) => {
    if (!draggedId || draggedId === item._id) return;
    // Only allow drop within same group
    const draggedItem = items.find((i) => i._id === draggedId);
    if (!draggedItem || draggedItem.grup !== item.grup) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(item._id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetItem: CustomCategory) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === targetItem._id) {
      setDraggedId(null);
      return;
    }
    const draggedItem = items.find((i) => i._id === draggedId);
    if (!draggedItem || draggedItem.grup !== targetItem.grup) {
      setDraggedId(null);
      return;
    }

    // Build the new order for this group
    const inGroup = items
      .filter((i) => i.grup === targetItem.grup)
      .sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
    const fromIdx = inGroup.findIndex((i) => i._id === draggedId);
    const toIdx = inGroup.findIndex((i) => i._id === targetItem._id);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggedId(null);
      return;
    }
    const reordered = [...inGroup];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Optimistic UI
    const newOrdineById = new Map(reordered.map((it, idx) => [it._id, idx]));
    setItems((prev) =>
      prev.map((it) =>
        newOrdineById.has(it._id) ? { ...it, ordine: newOrdineById.get(it._id) } : it
      )
    );
    setDraggedId(null);

    // Persist
    const result = await callApi({
      action: "reorder",
      orderedIds: reordered.map((it) => it._id),
    });
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut salva ordinea.");
      await refresh();
      return;
    }
    onChange?.();
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5">
      <header>
        <h2 className="text-lg font-semibold text-gray-900">Categorii</h2>
        <p className="mt-1 text-sm text-gray-500">
          Trage cu mausul de o categorie pentru a-i schimba poziția. Modificările apar imediat pe site.
        </p>
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
            {groupTitles.map((g) => (
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
        ) : (
          grouped.map((g) =>
            g.items.length > 0 ? (
              <div key={g.title}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">{g.title}</p>
                <ul className="space-y-1.5">
                  {g.items.map((item) => {
                    const isEditing = editingId === item._id;
                    const isDragged = draggedId === item._id;
                    const isDragOver = dragOverId === item._id;
                    return (
                      <li
                        key={item._id}
                        draggable={!isEditing}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, item)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`flex flex-col gap-2 rounded-lg border bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                          isDragged
                            ? "opacity-40 border-gray-200"
                            : isDragOver
                            ? "border-green-400 bg-green-50"
                            : "border-gray-200"
                        } ${isEditing ? "cursor-default" : "cursor-move"}`}
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
                              {Array.from(new Set([...groupTitles, editGrup].filter(Boolean))).map((g) => (
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
                              <span className="text-gray-400 select-none" aria-hidden>⋮⋮</span>
                              <span className="text-sm text-gray-800">{item.label}</span>
                            </div>
                            <div className="flex gap-1.5">
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
