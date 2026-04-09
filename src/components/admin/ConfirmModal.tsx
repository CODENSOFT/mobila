// ConfirmModal.tsx
"use client";

import { useEffect } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmă",
  cancelLabel = "Anulează",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onCancel : undefined}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header with icon */}
        <div className="px-6 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <div className="px-6 py-4 text-center">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Se procesează...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}