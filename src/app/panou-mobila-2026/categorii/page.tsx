"use client";

import { useState } from "react";
import CategoryManager from "@/src/components/admin/CategoryManager";
import SectionManager from "@/src/components/admin/SectionManager";

export default function PanouCategoriiPage() {
  // Bump on section changes so CategoryManager re-fetches the group options.
  const [sectionsSignal, setSectionsSignal] = useState(0);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Categorii și secțiuni</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrează secțiunile (grupurile) și categoriile disponibile pe site — creează, redenumește, mută și șterge.
        </p>
      </header>

      <SectionManager onChange={() => setSectionsSignal((s) => s + 1)} />
      <CategoryManager refreshSignal={sectionsSignal} />
    </div>
  );
}
