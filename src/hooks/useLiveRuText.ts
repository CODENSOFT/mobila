"use client";

import { useEffect, useState } from "react";

import { translateRoToRuCached } from "@/src/lib/liveRuTranslate";

/**
 * Pentru limba rusă: afișează traducerea din textul RO (cache).
 * Pentru română: returnează textul sursă.
 */
export function useLiveRuText(romanian: string, lang: string): { text: string; loading: boolean } {
  const isRu = lang === "ru";
  const [text, setText] = useState(romanian);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isRu) return;

    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setText(romanian);
      const ru = await translateRoToRuCached(romanian);
      if (cancelled) return;
      setText(ru ?? romanian);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isRu, romanian]);

  if (!isRu) {
    return { text: romanian, loading: false };
  }

  return { text, loading };
}
