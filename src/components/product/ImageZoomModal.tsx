"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

export type ImageZoomModalProps = {
  imagini: string[];
  indexStart: number;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const WHEEL_STEP = 0.12;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function ImageZoomModal({
  imagini,
  indexStart,
  onClose,
}: ImageZoomModalProps) {
  const mounted = useIsClient();
  const [entered, setEntered] = useState(false);
  const [index, setIndex] = useState(() =>
    clamp(
      indexStart,
      0,
      Math.max(0, imagini.length - 1)
    )
  );
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  const dialogRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + imagini.length) % imagini.length);
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, [imagini.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % imagini.length);
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, [imagini.length]);

  const goPrevRef = useRef(goPrev);
  const goNextRef = useRef(goNext);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    goPrevRef.current = goPrev;
    goNextRef.current = goNext;
  }, [goPrev, goNext]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (scale > 1.01) return;
    const id = requestAnimationFrame(() => {
      setPan({ x: 0, y: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [scale]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) =>
        clamp(s + (e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP), MIN_SCALE, MAX_SCALE)
      );
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevRef.current();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNextRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    const container = dialogRef.current;
    if (!container) return;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          "button:not([disabled])[data-zoom-control]"
        )
      );

    const focusFirst = () => {
      const list = focusables();
      list[0]?.focus();
    };

    focusFirst();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onTab);
    return () => {
      document.removeEventListener("keydown", onTab);
      prevActive?.focus?.();
    };
  }, []);

  const pinchRef = useRef<{
    dist0: number;
    scale0: number;
  } | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const panDragRef = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const handleBackdropPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const t = e.target as Node;
    if (wheelRef.current?.contains(t)) return;
    if ((e.target as HTMLElement).closest("[data-zoom-control]")) return;
    onClose();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const a = e.touches[0];
      const b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { dist0: dist, scale0: scaleRef.current };
      swipeRef.current = null;
      panDragRef.current = null;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      pinchRef.current = null;
      if (scaleRef.current > 1.02) {
        panDragRef.current = { x: t.clientX, y: t.clientY };
        swipeRef.current = null;
      } else {
        swipeRef.current = { x: t.clientX, y: t.clientY };
        panDragRef.current = null;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const a = e.touches[0];
      const b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ratio = dist / pinchRef.current.dist0;
      const next = clamp(pinchRef.current.scale0 * ratio, MIN_SCALE, MAX_SCALE);
      setScale(next);
    } else if (e.touches.length === 1 && panDragRef.current && scaleRef.current > 1.02) {
      const t = e.touches[0];
      const last = panDragRef.current;
      const dx = t.clientX - last.x;
      const dy = t.clientY - last.y;
      panDragRef.current = { x: t.clientX, y: t.clientY };
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length > 0) return;
    pinchRef.current = null;
    panDragRef.current = null;

    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || e.changedTouches.length === 0) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (scaleRef.current > 1.02) return;

    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      onClose();
      return;
    }
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrev();
      else goNext();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1.02) return;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || scale <= 1.02) return;
    setPan((p) => ({
      x: p.x + e.movementX,
      y: p.y + e.movementY,
    }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
    dragging.current = false;
  };

  if (!mounted || imagini.length === 0) return null;

  const src = imagini[index] ?? "";
  const label = `${index + 1} / ${imagini.length}`;

  const modal = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Vizualizare imagine produs mărită"
      className={`group fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-200 ease-out ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onPointerDown={handleBackdropPointerDown}
    >
      <button
        type="button"
        data-zoom-control
        aria-label="Închide vizualizarea imaginii"
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6 md:top-6"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {imagini.length > 1 ? (
        <>
          <button
            type="button"
            data-zoom-control
            aria-label="Imaginea anterioară"
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-70 transition hover:bg-white/20 group-hover:opacity-100 md:left-4 md:opacity-0 md:group-hover:opacity-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            data-zoom-control
            aria-label="Imaginea următoare"
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-70 transition hover:bg-white/20 md:right-4 md:opacity-0 md:group-hover:opacity-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      ) : null}

      <div
        className={`relative z-10 flex max-h-[90vh] max-w-[96vw] flex-col items-center transition-transform duration-200 ease-out ${
          entered ? "scale-100" : "scale-[0.95]"
        }`}
      >
        <div
          ref={wheelRef}
          className="relative flex max-h-[80vh] max-w-[96vw] touch-none items-center justify-center overflow-visible"
          style={{ touchAction: "none" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic remote URLs, zoom/pan */}
          <img
            src={src}
            alt="Imagine produs — vizualizare mărită"
            draggable={false}
            className="max-h-[80vh] max-w-[96vw] select-none object-contain transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        </div>

        <p
          data-zoom-control
          className="mt-4 text-sm tabular-nums text-white/80"
          aria-live="polite"
        >
          {label}
        </p>
        <p className="mt-1 text-center text-xs text-white/40">
          Scroll pentru zoom · Esc pentru închidere
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
