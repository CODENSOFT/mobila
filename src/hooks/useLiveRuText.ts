"use client";

import { useEffect, useState } from "react";

import { translateRoToRuCached } from "@/src/lib/liveRuTranslate";

/**
 * Pentru limba rusă: afișează traducerea din textul RO (cache).
 * Pentru română: returnează textul sursă.
 */
export function useLiveRuText(romanian: string, lang: string): { text: string; loading: boolean } {
  const [text, setText] = useState(romanian);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang !== "ru") {
      setText(romanian);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setText(romanian);

    void translateRoToRuCached(romanian).then((ru) => {
      if (cancelled) return;
      setText(ru ?? romanian);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [lang, romanian]);

  return { text, loading };
}
