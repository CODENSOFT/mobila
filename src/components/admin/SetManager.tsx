"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadToCloudinary } from "@/src/lib/cloudinary-client";

type SetDoc = {
  _id: string;
  key: string;
  nume: string;
  nume_ru: string;
  descriere: string;
  descriere_ru: string;
  imagine: string;
  imagini: string[];
};

const EMPTY: SetDoc = {
  _id: "",
  key: "",
  nume: "",
  nume_ru: "",
  descriere: "",
  descriere_ru: "",
  imagine: "",
  imagini: [],
};

export default function SetManager() {
  const [items, setItems] = useState<SetDoc[]>([]);
  const [productSetNames, setProductSetNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<SetDoc | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // Drag-and-drop reorder state for gallery thumbnails
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/seturi", { cache: "no-store" });
      const data = (await res.json()) as SetDoc[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProductSets = useCallback(async () => {
    try {
      const res = await fetch("/api/produse", { cache: "no-store" });
      const products = (await res.json()) as { set?: string }[];
      const names = Array.from(
        new Set(
          products
            .map((p) => (typeof p.set === "string" ? p.set.trim() : ""))
            .filter((s) => s !== "")
        )
      ).sort();
      setProductSetNames(names);
    } catch {
      setProductSetNames([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
    void refreshProductSets();
  }, [refresh, refreshProductSets]);

  const startEdit = (s: SetDoc | null) => {
    setError(null);
    setEditing(s ?? { ...EMPTY });
  };

  const handleSave = async () => {
    if (!editing) return;
    setError(null);
    const key = editing.key.trim();
    if (!key) {
      setError("Cheia (key) este obligatorie. Folosește numele setului din produse, ex: Amigo");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/seturi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          id: editing._id || undefined,
          key,
          nume: editing.nume || key,
          nume_ru: editing.nume_ru,
          descriere: editing.descriere,
          descriere_ru: editing.descriere_ru,
          imagine: editing.imagine,
          imagini: editing.imagini,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.message ?? "Nu s-a putut salva.");
        return;
      }
      await refresh();
      setEditing(null);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (s: SetDoc) => {
    if (!confirm(`Șterge setul „${s.nume || s.key}"?`)) return;
    setBusy(true);
    try {
      await fetch("/api/seturi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: s._id }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleImageUpload = async (file: File, target: "main" | "gallery") => {
    if (!editing) return;
    setBusy(true);
    try {
      const url = await uploadToCloudinary(file);
      if (target === "main") {
        setEditing((prev) => (prev ? { ...prev, imagine: url } : prev));
      } else {
        setEditing((prev) => (prev ? { ...prev, imagini: [...prev.imagini, url] } : prev));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload eșuat.");
    } finally {
      setBusy(false);
    }
  };

  // Upload multiple gallery images in parallel with progress tracking
  const handleGalleryUpload = async (files: File[]) => {
    if (!editing || files.length === 0) return;
    setError(null);
    setUploadProgress({ done: 0, total: files.length });
    const uploadedUrls: string[] = [];
    let done = 0;
    await Promise.all(
      files.map(async (file) => {
        try {
          const url = await uploadToCloudinary(file);
          uploadedUrls.push(url);
        } catch (e) {
          console.error("Upload failed for", file.name, e);
          setError(`Eroare la upload-ul fișierului „${file.name}"`);
        } finally {
          done += 1;
          setUploadProgress({ done, total: files.length });
        }
      })
    );
    setEditing((prev) => (prev ? { ...prev, imagini: [...prev.imagini, ...uploadedUrls] } : prev));
    setUploadProgress(null);
  };

  const removeGalleryImage = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, imagini: editing.imagini.filter((_, i) => i !== idx) });
  };

  const handleGalleryDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", String(idx)); } catch {}
  };
  const handleGalleryDragOver = (e: React.DragEvent, idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  };
  const handleGalleryDragLeave = () => setDragOverIdx(null);
  const handleGalleryDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    if (!editing || draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      return;
    }
    const next = [...editing.imagini];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(targetIdx, 0, moved);
    setEditing({ ...editing, imagini: next });
    setDraggedIdx(null);
  };
  const handleGalleryDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    await handleGalleryUpload(files);
  };

  // Sets present in products but not yet in DB
  const existingKeys = new Set(items.map((i) => i.key));
  const missingSets = productSetNames.filter((n) => !existingKeys.has(n));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5">
      <header>
        <h2 className="text-lg font-semibold text-gray-900">Seturi</h2>
        <p className="mt-1 text-sm text-gray-500">
          Setează numele, descrierea și fotografiile pentru fiecare set. Produsele
          care fac parte din set sunt determinate prin câmpul „Set" din fiecare produs.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {/* Quick-create from existing product sets */}
      {missingSets.length > 0 && !editing && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
          <p className="font-medium text-amber-900 mb-2">
            Sunt {missingSets.length} seturi în produse care nu au încă pagină de set:
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSets.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => startEdit({ ...EMPTY, key: s, nume: s })}
                className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
              >
                + Creează „{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      {!editing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Seturi existente</p>
            <button
              type="button"
              onClick={() => startEdit(null)}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
            >
              + Set nou
            </button>
          </div>
          {isLoading ? (
            <p className="text-sm text-gray-400">Se încarcă...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400">Nu există seturi încă.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {s.imagine ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.imagine} alt={s.nume} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.nume || s.key}</p>
                      <p className="text-xs text-gray-500 truncate">key: {s.key}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Editează
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Șterge
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Cheie (key) — trebuie să fie identică cu „Set" din produsele asociate
              </span>
              <input
                type="text"
                value={editing.key}
                onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                placeholder="ex: Amigo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Nume RO</span>
              <input
                type="text"
                value={editing.nume}
                onChange={(e) => setEditing({ ...editing, nume: e.target.value })}
                placeholder="ex: Dormitor Amigo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Nume RU (opțional)</span>
              <input
                type="text"
                value={editing.nume_ru}
                onChange={(e) => setEditing({ ...editing, nume_ru: e.target.value })}
                placeholder="ex: Спальня Амиго"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Descriere RO</span>
            <textarea
              value={editing.descriere}
              onChange={(e) => setEditing({ ...editing, descriere: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-y"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Descriere RU (opțional)</span>
            <textarea
              value={editing.descriere_ru}
              onChange={(e) => setEditing({ ...editing, descriere_ru: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-y"
            />
          </label>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Imagine principală</p>
            <div className="flex items-center gap-3">
              {editing.imagine ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.imagine} alt="main" className="h-20 w-20 rounded object-cover" />
              ) : (
                <div className="h-20 w-20 rounded bg-gray-200" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleImageUpload(f, "main");
                  e.target.value = "";
                }}
                className="text-sm"
              />
              {editing.imagine && (
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, imagine: "" })}
                  className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Șterge
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Galerie ({editing.imagini.length})
              </p>
              {editing.imagini.length > 0 && (
                <button
                  type="button"
                  onClick={() => editing && setEditing({ ...editing, imagini: [] })}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Șterge tot
                </button>
              )}
            </div>

            {editing.imagini.length > 0 && (
              <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {editing.imagini.map((url, i) => {
                  const isDragged = draggedIdx === i;
                  const isOver = dragOverIdx === i;
                  return (
                    <div
                      key={`${url}-${i}`}
                      draggable
                      onDragStart={(e) => handleGalleryDragStart(e, i)}
                      onDragOver={(e) => handleGalleryDragOver(e, i)}
                      onDragLeave={handleGalleryDragLeave}
                      onDrop={(e) => handleGalleryDrop(e, i)}
                      onDragEnd={handleGalleryDragEnd}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-move transition-all ${
                        isDragged
                          ? "opacity-40 border-gray-200"
                          : isOver
                          ? "border-green-500 scale-[1.02]"
                          : "border-gray-200"
                      }`}
                      title="Trage cu mausul pentru a reordona"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`gal-${i}`} className="h-full w-full object-cover pointer-events-none" />
                      {/* Overlay with delete button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGalleryImage(i);
                          }}
                          className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Șterge
                        </button>
                      </div>
                      {/* Position number */}
                      <div className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white/95 text-[10px] font-bold text-gray-700 flex items-center justify-center pointer-events-none">
                        {i + 1}
                      </div>
                      {/* Drag handle indicator */}
                      <div className="absolute top-1 right-1 rounded bg-white/95 px-1 py-0.5 text-[9px] font-bold text-gray-500 pointer-events-none">
                        ⋮⋮
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Drop zone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
                dragOver
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white hover:border-green-400 hover:bg-gray-50"
              }`}
            >
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Trage mai multe fotografii aici sau click pentru a selecta
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Poți selecta multiple fișiere odată. PNG / JPG / WebP, max 50MB fiecare.
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length > 0) await handleGalleryUpload(files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>

            {/* Progress indicator */}
            {uploadProgress && uploadProgress.total > 0 && (
              <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                <p className="text-xs text-blue-800 font-medium mb-1">
                  Se încarcă {uploadProgress.done} / {uploadProgress.total} fotografii...
                </p>
                <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {busy ? "Se salvează..." : "Salvează"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              disabled={busy}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
