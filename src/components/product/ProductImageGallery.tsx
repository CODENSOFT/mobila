"use client";

import { useCallback, useMemo, useState } from "react";

import ImageZoomModal from "./ImageZoomModal";

export function normalizeProductImages(
  imagine: string,
  imagini?: string[] | null
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (u: unknown) => {
    if (typeof u !== "string") return;
    const t = u.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  add(imagine);
  for (const u of imagini ?? []) add(u);
  return out.length > 0 ? out : imagine.trim() ? [imagine.trim()] : [];
}

type ProductImageGalleryProps = {
  imagine: string;
  imagini?: string[] | null;
  alt: string;
};

export default function ProductImageGallery({
  imagine,
  imagini,
  alt,
}: ProductImageGalleryProps) {
  const urls = useMemo(
    () => normalizeProductImages(imagine, imagini),
    [imagine, imagini]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(0);

  const openModal = useCallback((index: number) => {
    setModalStart(clampIndex(index, urls.length));
    setModalOpen(true);
  }, [urls.length]);

  const mainSrc = urls[activeIndex] ?? urls[0] ?? "";

  if (urls.length === 0) {
    return (
      <div className="relative aspect-[4/5] rounded-sm bg-[#e7e5e4]" aria-hidden />
    );
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Deschide imaginea la dimensiune completă"
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-sm bg-[#e7e5e4] outline-none focus-visible:ring-2 focus-visible:ring-[#1c1917] focus-visible:ring-offset-2"
        onClick={() => openModal(activeIndex)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(activeIndex);
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic product URLs */}
        <img
          src={mainSrc}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </div>
      </div>

      {urls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              aria-label={`Afișează imaginea ${i + 1} din ${urls.length}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                i === activeIndex
                  ? "border-[#1c1917]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="text-center text-xs text-[#a8a29e]">
        Click pe imagine pentru zoom · folosește scroll în vizualizare pentru mărire
      </p>

      {modalOpen ? (
        <ImageZoomModal
          imagini={urls}
          indexStart={modalStart}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </div>
  );
}

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return Math.min(Math.max(0, i), len - 1);
}
