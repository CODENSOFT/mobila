"use client";

import SetManager from "@/src/components/admin/SetManager";

export default function PanouSeturiPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Seturi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrează paginile de prezentare ale seturilor: denumire, descriere, fotografii.
          Produsele care fac parte din fiecare set sunt determinate prin câmpul „Set" salvat la fiecare produs.
        </p>
      </header>
      <SetManager />
    </div>
  );
}
