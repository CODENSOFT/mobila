"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSections, type Section } from "@/src/lib/sections";
import { uploadToCloudinary } from "@/src/lib/cloudinary-client";

export default function SectionManager({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Drag-and-drop reorder
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchSections();
    setItems(data.sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const callApi = async (payload: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/sectiuni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) return { ok: false, message: data?.message ?? `Eroare ${res.status}` };
      return { ok: true };
    } catch {
      return { ok: false, message: "Eroare la rețea." };
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const title = newTitle.trim();
    if (!title) {
      setError("Scrie denumirea secțiunii.");
      return;
    }
    setBusy(true);
    const result = await callApi({ action: "create", title });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut crea secțiunea.");
      return;
    }
    setNewTitle("");
    await refresh();
    onChange?.();
  };

  const startEdit = (s: Section) => {
    setEditingId(s._id);
    setEditTitle(s.title);
    setError(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (s: Section) => {
    setError(null);
    const title = editTitle.trim();
    if (!title) {
      setError("Titlul nu poate fi gol.");
      return;
    }
    setBusy(true);
    const result = await callApi({ action: "update", id: s._id, title });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut salva.");
      return;
    }
    cancelEdit();
    await refresh();
    onChange?.();
  };

  const handleDelete = async (s: Section) => {
    if (!confirm(`Șterge secțiunea „${s.title}"?`)) return;
    setError(null);
    setBusy(true);
    const result = await callApi({ action: "delete", id: s._id });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "Nu s-a putut șterge.");
      return;
    }
    await refresh();
    onChange?.();
  };

  const handleImageUpload = async (s: Section, file: File) => {
    setError(null);
    setBusy(true);
    try {
      const url = await uploadToCloudinary(file);
      const result = await callApi({ action: "update", id: s._id, image: url });
      if (!result.ok) {
        setError(result.message ?? "Nu s-a putut salva imaginea.");
        return;
      }
      await refresh();
      onChange?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload eșuat.");
    } finally {
      setBusy(false);
    }
  };

  // ===== Drag & drop =====
  const handleDragStart = (e: React.DragEvent, s: Section) => {
    setDraggedId(s._id);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", s._id); } catch {}
  };
  const handleDragOver = (e: React.DragEvent, s: Section) => {
    if (!draggedId || draggedId === s._id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(s._id);
  };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = async (e: React.DragEvent, target: Section) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === target._id) {
      setDraggedId(null);
      return;
    }
    const fromIdx = items.findIndex((i) => i._id === draggedId);
    const toIdx = items.findIndex((i) => i._id === target._id);
    if (fromIdx < 0 || toIdx < 0) {
      setDraggedId(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setItems(reordered);
    setDraggedId(null);
    const result = await callApi({ action: "reorder", orderedIds: reordered.map((i) => i._id) });
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
        <h2 className="text-lg font-semibold text-gray-900">Secțiuni</h2>
        <p className="mt-1 text-sm text-gray-500">
          Secțiunile grupează categoriile pe site (ex: „PENTRU DORMITOR”). Trage cu mausul pentru a schimba ordinea.
          Categoriile se atribuie unei secțiuni din lista de mai jos.
        </p>
      </header>

      <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Secțiune nouă</span>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="ex: PENTRU BAIE"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
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

      {isLoading ? (
        <p className="text-sm text-gray-400">Se încarcă...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">Nu există secțiuni încă.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => {
            const isEditing = editingId === s._id;
            const isDragged = draggedId === s._id;
            const isDragOver = dragOverId === s._id;
            return (
              <li
                key={s._id}
                draggable={!isEditing}
                onDragStart={(e) => handleDragStart(e, s)}
                onDragOver={(e) => handleDragOver(e, s)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, s)}
                onDragEnd={handleDragEnd}
                className={`flex flex-col gap-2 rounded-lg border bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                  isDragged ? "opacity-40 border-gray-200" : isDragOver ? "border-green-400 bg-green-50" : "border-gray-200"
                } ${isEditing ? "cursor-default" : "cursor-move"}`}
              >
                {isEditing ? (
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => saveEdit(s)}
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
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-gray-400 select-none" aria-hidden>⋮⋮</span>
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.title} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200" />
                      )}
                      <span className="text-sm font-medium text-gray-800 truncate">{s.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
                        Imagine
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleImageUpload(s, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Redenumește
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        disabled={busy}
                        className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Șterge
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
