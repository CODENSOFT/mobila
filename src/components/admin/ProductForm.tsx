"use client";

import { FormEvent, useState, useCallback, useEffect, useRef } from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_GROUPS,
  type ProductCategory,
} from "../../constants/categories";
import { formatPriceInteger } from "@/src/lib/formatPrice";
import { uploadToCloudinary } from "@/src/lib/cloudinary-client";
import { fetchCustomCategories, type CustomCategory } from "@/src/lib/customCategories";
import { fetchSections } from "@/src/lib/sections";
import type { Product } from "../../types/product";

export const ADMIN_CATEGORIES = PRODUCT_CATEGORIES;
export type AdminCategory = ProductCategory;
type AdminCategoryGroupTitle = (typeof PRODUCT_CATEGORY_GROUPS)[number]["title"];

// Wardrobes are a standalone top-level category on the site (not nested under a
// section), so the product form offers them directly in the "Pentru" selector.
const STANDALONE_GROUP = "Dulapuri";

type ProductFormValues = {
  nume: string;
  numeRu: string;
  pret: string;
  categorie: AdminCategory;
  imagineUrl: string;
  areReducere: boolean;
  pretReducere: string;
  procentReducere: string;
  set: string;
};

type ProductFormPayload = {
  nume: string;
  nume_ru: string;
  descriere: string;
  descriere_ru: string;
  pret: number;
  categorie: AdminCategory;
  imagineUrl: string;
  imagineFile?: File | null;
  areReducere: boolean;
  pretReducere?: number;
  procentReducere?: number;
  imaginiFiles?: File[];
  imaginiUrls?: string[];
  set?: string;
  grup?: string;
};

type ExtraImage = { id: string; file: File | null; url: string };

type ProductFormProps = {
  mode: "create" | "edit";
  initialProduct?: Product;
  onSubmit: (payload: ProductFormPayload) => Promise<void>;
  submittingLabel?: string;
};

function toInitialValues(product?: Product): ProductFormValues {
  return {
    nume: product?.nume ?? "",
    numeRu: product?.nume_ru ?? "",
    pret: product?.pret ? String(product.pret) : "",
    categorie: (product?.categorie as AdminCategory) ?? ADMIN_CATEGORIES[0],
    imagineUrl: product?.imagine ?? "",
    areReducere: product?.areReducere ?? false,
    pretReducere: product?.pretReducere ? String(product.pretReducere) : "",
    procentReducere: product?.procentReducere ? String(product.procentReducere) : "",
    set: product?.set ?? "",
  };
}

function initialDescriptionRO(product?: Product): string {
  return product?.descriere ?? "";
}

function initialDescriptionRU(product?: Product): string {
  return product?.descriere_ru ?? "";
}

/** Compară textul returnat de API cu sursa (ex. text neschimbat la traducere). */
function isSameAsSource(translated: string, source: string): boolean {
  const a = translated.trim().replace(/\r\n/g, "\n");
  const b = source.trim().replace(/\r\n/g, "\n");
  return a === b;
}

function getGroupForCategory(category: AdminCategory): AdminCategoryGroupTitle {
  const foundGroup = PRODUCT_CATEGORY_GROUPS.find((group) =>
    (group.items as readonly AdminCategory[]).includes(category)
  );
  return foundGroup?.title ?? PRODUCT_CATEGORY_GROUPS[0].title;
}

function SetSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [existingSets, setExistingSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSets = useCallback(() => {
    setLoading(true);
    return fetch(`/api/produse?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => {
        if (!Array.isArray(data)) return;
        const seen = new Set<string>();
        for (const p of data as { set?: unknown }[]) {
          if (typeof p.set === "string" && p.set.trim()) {
            seen.add(p.set.trim());
          }
        }
        const sets = [...seen].sort();
        setExistingSets(sets);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSets().then(() => {
      if (document.activeElement === inputRef.current) {
        setOpen(true);
      }
    });
  }, [fetchSets]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleFocus = () => {
    setOpen(true);
    void fetchSets();
  };

  const typed = value.trim().toLowerCase();
  const suggestions = typed === ""
    ? existingSets
    : existingSets.filter((s) => s.toLowerCase().includes(typed));

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Set <span className="text-xs font-normal text-gray-400">— opțional</span>
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={handleFocus}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        placeholder={loading && existingSets.length === 0 ? "Se încarcă seturi..." : "ex: Amigo"}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {loading && existingSets.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">Se încarcă...</li>
          ) : existingSets.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400 italic">
              {value.trim() ? `Set nou: „${value}"` : "Scrie denumirea unui set nou..."}
            </li>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); onChange(s); setOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-green-50 hover:text-green-700 transition-colors ${value === s ? "bg-green-50 font-medium text-green-700" : "text-gray-700"}`}
                  >
                    {s}
                  </button>
                </li>
              ))}
              {typed !== "" && !existingSets.some((s) => s.toLowerCase() === typed) && (
                <li className="border-t border-gray-100 px-3 py-2 text-sm text-gray-400 italic">
                  Set nou: „{value}"
                </li>
              )}
            </>
          ) : (
            <li className="px-3 py-2 text-sm text-gray-400 italic">Set nou: „{value}"</li>
          )}
        </ul>
      )}
    </div>
  );
}

type TranslateRowResult =
  | { ok: true; translated: string }
  | { ok: false; error: string };

async function fetchRoToRu(text: string): Promise<TranslateRowResult> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source: "ro", target: "ru" }),
  });
  const data = (await res.json()) as {
    translated?: unknown;
    translation?: unknown;
    error?: string;
  };
  if (!res.ok) {
    return {
      ok: false,
      error:
        data.error?.trim() ||
        "Traducerea a eșuat. Încearcă din nou; dacă persistă, verifică rețeaua și accesul serverului la Google.",
    };
  }
  const raw = data.translated ?? data.translation;
  const translated =
    typeof raw === "string" ? raw.trim() : raw != null ? String(raw).trim() : "";
  if (!translated) {
    return { ok: false, error: "Traducerea nu a reușit: răspuns gol de la server." };
  }
  return { ok: true, translated };
}

export default function ProductForm({
  mode,
  initialProduct,
  onSubmit,
  submittingLabel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toInitialValues(initialProduct));
  const [descriptionRO, setDescriptionRO] = useState(() => initialDescriptionRO(initialProduct));
  const [descriptionRU, setDescriptionRU] = useState(() => initialDescriptionRU(initialProduct));
  // Section (grup) can be any admin-created section, not just the hardcoded ones.
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>(() =>
    getGroupForCategory(toInitialValues(initialProduct).categorie)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extraImages, setExtraImages] = useState<ExtraImage[]>(() =>
    (initialProduct?.imagini ?? []).map((url) => ({ id: Math.random().toString(36).slice(2), file: null, url }))
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValues | "descriere" | "descriere_ru", string>>
  >({});

  /** Sincronizare RO/RU doar la produs nou sau schimbare id — nu rescrie la fiecare re-render al părintelui. */
  const lastSyncedScopeRef = useRef<string | null>(null);

  const descRuTextareaRef = useRef<HTMLTextAreaElement>(null);
  const autoTranslateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualTranslateRef = useRef(false);

  useEffect(() => {
    const scopeId =
      initialProduct?._id != null
        ? `edit:${String(initialProduct._id)}`
        : mode === "create"
          ? "create"
          : "";
    if (!scopeId) return;
    if (lastSyncedScopeRef.current === scopeId) return;
    lastSyncedScopeRef.current = scopeId;
    const nextValues = toInitialValues(initialProduct);
    setValues(nextValues);
    setDescriptionRO(initialDescriptionRO(initialProduct));
    setDescriptionRU(initialDescriptionRU(initialProduct));
    const savedGrup = initialProduct?.grup;
    const isValidGrup = typeof savedGrup === "string" && savedGrup.trim().length > 0;
    setSelectedCategoryGroup(
      isValidGrup ? savedGrup.trim() : getGroupForCategory(nextValues.categorie)
    );
    setExtraImages(
      (initialProduct?.imagini ?? []).map((url) => ({ id: Math.random().toString(36).slice(2), file: null, url }))
    );
  }, [initialProduct, mode]);

  /** După ~2s fără modificări în RO, completează RU (dacă nu editezi direct câmpurile în rusă). */
  useEffect(() => {
    const roName = values.nume.trim();
    const roDesc = descriptionRO.trim();
    if (autoTranslateTimerRef.current) {
      clearTimeout(autoTranslateTimerRef.current);
      autoTranslateTimerRef.current = null;
    }
    if (!roName && !roDesc) return;

    let cancelled = false;

    autoTranslateTimerRef.current = setTimeout(() => {
      autoTranslateTimerRef.current = null;
      if (manualTranslateRef.current || cancelled) return;

      void (async () => {
        const skipDesc = document.activeElement === descRuTextareaRef.current;

        setIsTranslating(true);
        try {
          const [nameResult, descResult] = await Promise.all([
            roName ? fetchRoToRu(roName) : Promise.resolve(null),
            roDesc && !skipDesc ? fetchRoToRu(roDesc) : Promise.resolve(null),
          ]);

          if (cancelled || manualTranslateRef.current) return;

          if (nameResult?.ok) {
            setValues((p) => ({ ...p, numeRu: nameResult.translated }));
          }
          if (descResult?.ok && !isSameAsSource(descResult.translated, roDesc)) {
            setDescriptionRU(descResult.translated);
          }
        } catch (e) {
          console.error("[auto-translate]", e);
        } finally {
          setIsTranslating(false);
        }
      })();
    }, 2000);

    return () => {
      cancelled = true;
      if (autoTranslateTimerRef.current) {
        clearTimeout(autoTranslateTimerRef.current);
        autoTranslateTimerRef.current = null;
      }
    };
  }, [values.nume, descriptionRO]);

  const handleTranslateRoRu = async () => {
    const roName = values.nume.trim();
    const roDesc = descriptionRO.trim();
    if (!roName && !roDesc) {
      setMessage({
        type: "error",
        text: "Introdu numele produsului și/sau descrierea în română înainte de traducere.",
      });
      return;
    }

    if (autoTranslateTimerRef.current) {
      clearTimeout(autoTranslateTimerRef.current);
      autoTranslateTimerRef.current = null;
    }

    setMessage(null);
    manualTranslateRef.current = true;
    setIsTranslating(true);
    try {
      const [nameResult, descResult] = await Promise.all([
        roName ? fetchRoToRu(roName) : Promise.resolve(null),
        roDesc ? fetchRoToRu(roDesc) : Promise.resolve(null),
      ]);

      if (nameResult && nameResult.ok === false) {
        setMessage({ type: "error", text: nameResult.error });
        return;
      }
      if (descResult && descResult.ok === false) {
        setMessage({ type: "error", text: descResult.error });
        return;
      }

      if (nameResult?.ok) {
        setValues((p) => ({ ...p, numeRu: nameResult.translated }));
      }
      if (descResult?.ok) {
        if (isSameAsSource(descResult.translated, roDesc)) {
          setMessage({
            type: "error",
            text:
              "Descrierea nu s-a schimbat (răspunsul e identic cu textul în română). Verifică textul sursă sau încearcă din nou.",
          });
          return;
        }
        setDescriptionRU(descResult.translated);
      }

      const didName = Boolean(roName && nameResult?.ok);
      const didDesc = Boolean(roDesc && descResult?.ok);
      if (didName && didDesc) {
        setMessage({ type: "success", text: "Numele și descrierea au fost traduse în rusă." });
      } else if (didName) {
        setMessage({ type: "success", text: "Numele a fost tradus în rusă." });
      } else if (didDesc) {
        setMessage({ type: "success", text: "Descrierea a fost tradusă în rusă." });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Eroare la traducere. Verifică rețeaua și că ruta /api/translate este accesibilă.",
      });
    } finally {
      manualTranslateRef.current = false;
      setIsTranslating(false);
    }
  };

  const submitLabel = submittingLabel ?? (mode === "create" ? "Creează produs" : "Salvează modificările");
  const isEdit = mode === "edit";

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchCustomCategories().then((data) => {
      if (!cancelled) setCustomCategories(data);
    });
    fetchSections().then((data) => {
      if (!cancelled) setSectionTitles(data.filter((s) => !s.hidden).map((s) => s.title));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Section options: live sections + standalone "Dulapuri" + the currently
  // selected one (covers a product saved under a section since renamed/removed).
  const groupOptions = Array.from(
    new Set([...sectionTitles, STANDALONE_GROUP, selectedCategoryGroup].filter(Boolean))
  );

  // Categories come strictly from the DB (auto-seeded with hardcoded list on first run).
  // Filter hidden + sort by `ordine` so the dropdown reflects admin ordering.
  // For the standalone "Dulapuri" group the only category is "Dulapuri" itself.
  const categoriesForSelectedGroup: string[] =
    selectedCategoryGroup === STANDALONE_GROUP
      ? [STANDALONE_GROUP]
      : customCategories
          .filter((c) => !c.hidden && c.grup === selectedCategoryGroup)
          .sort((a, b) => {
            const oa = typeof a.ordine === "number" ? a.ordine : 0;
            const ob = typeof b.ordine === "number" ? b.ordine : 0;
            return oa - ob;
          })
          .map((c) => c.key);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!values.nume.trim()) newErrors.nume = "Numele este obligatoriu";
    if (!descriptionRO.trim()) newErrors.descriere = "Descrierea este obligatorie";
    const pretNum = Number(values.pret);
    if (Number.isNaN(pretNum) || pretNum <= 0) newErrors.pret = "Prețul trebuie să fie un număr valid";
    if (!values.imagineUrl.trim() && !imageFile && !isEdit) {
      newErrors.imagineUrl = "O imagine este necesară";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, descriptionRO, imageFile, isEdit]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!validate()) return;

    const pretNumber = Number(values.pret);
    setIsSubmitting(true);

    try {
      // Upload files directly to Cloudinary from browser (bypasses server size limits)
      let finalImageUrl = values.imagineUrl.trim();
      if (imageFile) {
        setMessage({ type: "success", text: "Se încarcă imaginea principală..." });
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const finalImaginiUrls: string[] = [];
      for (const img of extraImages) {
        if (img.file) {
          setMessage({ type: "success", text: "Se încarcă imagini suplimentare..." });
          finalImaginiUrls.push(await uploadToCloudinary(img.file));
        } else if (img.url.trim()) {
          finalImaginiUrls.push(img.url.trim());
        }
      }

      setMessage(null);

      await onSubmit({
        nume: values.nume.trim(),
        nume_ru: values.numeRu.trim(),
        descriere: descriptionRO.trim(),
        descriere_ru: descriptionRU.trim(),
        pret: pretNumber,
        categorie: values.categorie,
        imagineUrl: finalImageUrl,
        imagineFile: null,
        areReducere: values.areReducere,
        pretReducere: values.areReducere && values.pretReducere ? Number(values.pretReducere) : undefined,
        procentReducere: values.areReducere && values.procentReducere ? Number(values.procentReducere) : undefined,
        imaginiFiles: [],
        imaginiUrls: finalImaginiUrls,
        set: values.set.trim() || undefined,
        grup: selectedCategoryGroup,
      });

      if (mode === "create") {
        const resetValues = toInitialValues();
        setValues(resetValues);
        setDescriptionRO("");
        setDescriptionRU("");
        setSelectedCategoryGroup(getGroupForCategory(resetValues.categorie));
        setImageFile(null);
        setExtraImages([]);
      }
      setMessage({ type: "success", text: "Produs salvat cu succes!" });
    } catch (error) {
      const text = error instanceof Error ? error.message : "A apărut o eroare neașteptată";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const previewImage = values.imagineUrl || (imageFile ? URL.createObjectURL(imageFile) : null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Editează produs" : "Produs nou"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isEdit ? "Actualizează informațiile produsului" : "Adaugă un produs nou în catalog"}
              </p>
            </div>
            {message && (
              <div
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-sm sm:w-auto sm:max-w-md ${
                  message.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="min-w-0 wrap-break-word">{message.text}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Informații de bază
              </h2>
              <p className="mb-4 text-xs text-gray-500">
                Pe site, vizitatorii care aleg limba rusă văd numele și descrierea traduse automat din română (nu e
                nevoie să salvezi neapărat varianta RU). Aici poți totuși precompleta descrierea RU la ~2s după ce
                oprești din scris în română sau cu „Traduce automat RO→RU” (util pentru previzualizare sau export);
                dacă editezi direct descrierea în rusă, nu se suprascrie cât timp cursorul rămâne acolo.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume produs <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={values.nume}
                    onChange={(e) => setValues((p) => ({ ...p, nume: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="ex: Masă dining Oslo"
                  />
                  {errors.nume && <p className="mt-1 text-xs text-red-500">{errors.nume}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preț <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={values.pret}
                        onChange={(e) => setValues((p) => ({ ...p, pret: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="0.00"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">MDL</span>
                    </div>
                    {errors.pret && <p className="mt-1 text-xs text-red-500">{errors.pret}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pentru <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCategoryGroup}
                      onChange={(e) => {
                        const nextGroupTitle = e.target.value;
                        setSelectedCategoryGroup(nextGroupTitle);
                        // Standalone "Dulapuri" → category is always "Dulapuri".
                        if (nextGroupTitle === STANDALONE_GROUP) {
                          setValues((p) => ({ ...p, categorie: STANDALONE_GROUP as AdminCategory }));
                          return;
                        }
                        // Pick the first category that belongs to the chosen section
                        // (from DB), falling back to the hardcoded grouping.
                        const firstCustom = customCategories
                          .filter((c) => !c.hidden && c.grup === nextGroupTitle)
                          .sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0))[0]?.key;
                        const fallback = PRODUCT_CATEGORY_GROUPS.find(
                          (group) => group.title === nextGroupTitle
                        )?.items[0];
                        const nextCategory = (firstCustom ?? fallback) as AdminCategory | undefined;
                        if (nextCategory) {
                          setValues((p) => ({ ...p, categorie: nextCategory }));
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      {groupOptions.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={values.categorie}
                      onChange={(e) => setValues((p) => ({ ...p, categorie: e.target.value as AdminCategory }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      {categoriesForSelectedGroup.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                <SetSelector
                  value={values.set}
                  onChange={(v) => setValues((p) => ({ ...p, set: v }))}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere (RO) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descriptionRO}
                    onChange={(e) => setDescriptionRO(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    placeholder="Descrie produsul în detaliu..."
                  />
                  {errors.descriere && <p className="mt-1 text-xs text-red-500">{errors.descriere}</p>}
                </div>

                <div>
                  <div className="mb-2 flex flex-col gap-2 sm:mb-1 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Descriere (RU)
                      <span className="ml-1 text-xs font-normal text-gray-400">— opțional</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => void handleTranslateRoRu()}
                      disabled={isTranslating || (!values.nume.trim() && !descriptionRO.trim())}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-1"
                    >
                      {isTranslating ? (
                        <>
                          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Se traduce...
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          Traduce automat RO→RU
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    ref={descRuTextareaRef}
                    value={descriptionRU}
                    onChange={(e) => setDescriptionRU(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    placeholder="Описание товара на русском..."
                  />
                </div>
              </div>
            </div>

            {/* Reducere */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Reducere
              </h2>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={values.areReducere}
                    onClick={() => setValues((p) => ({ ...p, areReducere: !p.areReducere }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      values.areReducere ? "bg-red-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        values.areReducere ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-700">Are reducere</span>
                </label>

                {values.areReducere && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Preț redus
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={values.pretReducere}
                          onChange={(e) => setValues((p) => ({ ...p, pretReducere: e.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                          placeholder="0.00"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">MDL</span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Procent reducere <span className="text-xs font-normal text-gray-400">— opțional</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          step="1"
                          value={values.procentReducere}
                          onChange={(e) => setValues((p) => ({ ...p, procentReducere: e.target.value }))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                          placeholder="ex: 20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Imagine principală
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Imagine {!isEdit && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="url"
                    value={values.imagineUrl}
                    onChange={(e) => setValues((p) => ({ ...p, imagineUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  {errors.imagineUrl && <p className="mt-1 text-xs text-red-500">{errors.imagineUrl}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400">sau</span>
                  </div>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
                    dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      {imageFile ? imageFile.name : "Trage o imagine aici sau click pentru a selecta"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG până la 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Images */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Imagini suplimentare
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setExtraImages((prev) => [
                      ...prev,
                      { id: Math.random().toString(36).slice(2), file: null, url: "" },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-md bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Adaugă imagine
                </button>
              </div>

              {extraImages.length === 0 ? (
                <p className="text-xs text-gray-400">Nicio imagine suplimentară. Apasă „Adaugă imagine" pentru a adăuga.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {extraImages.map((img, idx) => {
                    const preview = img.file
                      ? URL.createObjectURL(img.file)
                      : img.url.trim() || null;
                    return (
                      <div key={img.id} className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => setExtraImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                          aria-label="Șterge"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {preview ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={preview} alt="preview" className="aspect-square w-full object-cover" />
                        ) : (
                          <div className="aspect-square flex flex-col items-center justify-center gap-2 p-2">
                            <label className="flex w-full cursor-pointer flex-col items-center gap-1 rounded border border-dashed border-gray-300 py-2 text-center text-[10px] text-gray-500 hover:border-green-400">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Fișier
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f)
                                    setExtraImages((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, file: f, url: "" } : item))
                                    );
                                }}
                              />
                            </label>
                            <p className="text-[9px] text-gray-400">sau URL</p>
                            <input
                              type="url"
                              value={img.url}
                              onChange={(e) =>
                                setExtraImages((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, url: e.target.value, file: null } : item))
                                )
                              }
                              placeholder="https://..."
                              className="w-full rounded border border-gray-300 px-2 py-1 text-[10px] focus:border-green-500 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Previzualizare
                </h2>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {previewImage ? (
                    <div className="relative aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob/data preview URLs */}
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {values.areReducere && (
                        <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          {values.procentReducere ? `-${values.procentReducere}%` : "REDUCERE"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-xs text-gray-400">Nicio imagine</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {values.nume || "Nume produs"}
                    </h3>
                    {values.numeRu.trim() ? (
                      <p className="text-xs text-gray-500 line-clamp-1" lang="ru">
                        {values.numeRu}
                      </p>
                    ) : null}
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {descriptionRO || "Descrierea va apărea aici..."}
                    </p>
                    {descriptionRU.trim() ? (
                      <p className="text-xs text-gray-400 line-clamp-2" lang="ru">
                        {descriptionRU}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        {values.areReducere && values.pretReducere ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              {formatPriceInteger(Number(values.pretReducere))} MDL
                            </span>
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              {values.pret ? `${formatPriceInteger(Number(values.pret))} MDL` : ""}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-green-600">
                            {values.pret ? `${formatPriceInteger(Number(values.pret))} MDL` : "—"}
                          </span>
                        )}
                      </div>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {values.categorie}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {submitLabel}
                    </>
                  )}
                </button>

                {isEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      if (autoTranslateTimerRef.current) {
                        clearTimeout(autoTranslateTimerRef.current);
                        autoTranslateTimerRef.current = null;
                      }
                      const initialValues = toInitialValues(initialProduct);
                      setValues(initialValues);
                      setDescriptionRO(initialDescriptionRO(initialProduct));
                      setDescriptionRU(initialDescriptionRU(initialProduct));
                      setSelectedCategoryGroup(getGroupForCategory(initialValues.categorie));
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Resetează
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}