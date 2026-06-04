"use client";

import CategoryManager from "@/src/components/admin/CategoryManager";

export default function PanouCategoriiPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Categorii</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrează categoriile disponibile pe site — editează denumirea, mută între grupuri, adaugă sau șterge.
        </p>
      </header>

      <CategoryManager />
    </div>
  );
}
