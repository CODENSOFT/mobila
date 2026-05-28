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

function GalleryImage({
  url,
  alt,
  index,
  onOpen,
  className,
}: {
  url: string;
  alt: string;
  index: number;
  onOpen: (i: number) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={`Deschide imaginea ${index + 1}`}
      onClick={() => onOpen(index)}
      className={`group relative cursor-zoom-in overflow-hidden rounded-sm bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#1c1917] focus-visible:ring-offset-2 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={index === 0 ? alt : ""}
        className="h-full w-full object-contain"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
        aria-hidden
      />
    </button>
  );
}

export default function ProductImageGallery({
  imagine,
  imagini,
  alt,
}: ProductImageGalleryProps) {
  const urls = useMemo(
    () => normalizeProductImages(imagine, imagini),
    [imagine, imagini]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(0);

  const openModal = useCallback((index: number) => {
    setModalStart(Math.min(Math.max(0, index), urls.length - 1));
    setModalOpen(true);
  }, [urls.length]);

  if (urls.length === 0) {
    return <div className="aspect-[4/5] rounded-sm bg-[#e7e5e4]" aria-hidden />;
  }

  /* ── 1 imagine: singură pe toată lățimea ── */
  if (urls.length === 1) {
    return (
      <>
        <GalleryImage url={urls[0]} alt={alt} index={0} onOpen={openModal} className="aspect-[4/5] w-full" />
        {modalOpen && <ImageZoomModal imagini={urls} indexStart={modalStart} onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  const row1 = urls.slice(0, 2);
  const row2 = urls.slice(2, 5);

  return (
    <div className="space-y-2">
      {/* Rândul 1 — 2 fotografii mari */}
      <div className="grid grid-cols-2 gap-2">
        {row1.map((url, i) => (
          <GalleryImage
            key={url}
            url={url}
            alt={alt}
            index={i}
            onOpen={openModal}
            className="aspect-[3/4] w-full"
          />
        ))}
      </div>

      {/* Rândul 2 — până la 3 fotografii mai mici */}
      {row2.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {row2.map((url, i) => (
            <GalleryImage
              key={url}
              url={url}
              alt={alt}
              index={i + 2}
              onOpen={openModal}
              className="aspect-[4/3] w-full"
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ImageZoomModal
          imagini={urls}
          indexStart={modalStart}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
