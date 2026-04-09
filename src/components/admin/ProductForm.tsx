"use client";

import { FormEvent, useState, useCallback } from "react";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../../constants/categories";
import type { Product } from "../../types/product";

export const ADMIN_CATEGORIES = PRODUCT_CATEGORIES;
export type AdminCategory = ProductCategory;

type ProductFormValues = {
  nume: string;
  descriere: string;
  pret: string;
  categorie: AdminCategory;
  imagineUrl: string;
};

type ProductFormPayload = {
  nume: string;
  descriere: string;
  pret: number;
  categorie: AdminCategory;
  imagineUrl: string;
  imagineFile?: File | null;
};

type ProductFormProps = {
  mode: "create" | "edit";
  initialProduct?: Product;
  onSubmit: (payload: ProductFormPayload) => Promise<void>;
  submittingLabel?: string;
};

function toInitialValues(product?: Product): ProductFormValues {
  return {
    nume: product?.nume ?? "",
    descriere: product?.descriere ?? "",
    pret: product?.pret ? String(product.pret) : "",
    categorie: (product?.categorie as AdminCategory) ?? ADMIN_CATEGORIES[0],
    imagineUrl: product?.imagine ?? "",
  };
}

export default function ProductForm({
  mode,
  initialProduct,
  onSubmit,
  submittingLabel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toInitialValues(initialProduct));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});

  const submitLabel = submittingLabel ?? (mode === "create" ? "Creează produs" : "Salvează modificările");
  const isEdit = mode === "edit";

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!values.nume.trim()) newErrors.nume = "Numele este obligatoriu";
    if (!values.descriere.trim()) newErrors.descriere = "Descrierea este obligatorie";
    const pretNum = Number(values.pret);
    if (Number.isNaN(pretNum) || pretNum <= 0) newErrors.pret = "Prețul trebuie să fie un număr valid";
    if (!values.imagineUrl.trim() && !imageFile && !isEdit) {
      newErrors.imagineUrl = "O imagine este necesară";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, imageFile, isEdit]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (!validate()) return;

    const pretNumber = Number(values.pret);
    setIsSubmitting(true);

    try {
      await onSubmit({
        nume: values.nume.trim(),
        descriere: values.descriere.trim(),
        pret: pretNumber,
        categorie: values.categorie,
        imagineUrl: values.imagineUrl.trim(),
        imagineFile: imageFile,
      });

      if (mode === "create") {
        setValues(toInitialValues());
        setImageFile(null);
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
          <div className="flex items-center justify-between">
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
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
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
                {message.text}
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
                      Categorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={values.categorie}
                      onChange={(e) => setValues((p) => ({ ...p, categorie: e.target.value as AdminCategory }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      {ADMIN_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descriere <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={values.descriere}
                    onChange={(e) => setValues((p) => ({ ...p, descriere: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    placeholder="Descrie produsul în detaliu..."
                  />
                  {errors.descriere && <p className="mt-1 text-xs text-red-500">{errors.descriere}</p>}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Imagine produs
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
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {values.descriere || "Descrierea va apărea aici..."}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-lg font-bold text-green-600">
                        {values.pret ? `${Number(values.pret).toLocaleString()} MDL` : "—"}
                      </span>
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
                    onClick={() => setValues(toInitialValues(initialProduct))}
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