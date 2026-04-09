import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, Box, ClipboardList, Grid2X2, LayoutPanelLeft } from "lucide-react";

import { PRODUCT_CATEGORY_GROUPS } from "../../../src/constants/categories";
import type { Product } from "../../../src/types/product";

type DashboardStats = {
  total: number;
  byCategory: {
    Bucatarie: number;
    Dormitor: number;
    Living: number;
  };
};

async function getProducts(): Promise<Product[]> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl && !host) {
    return [];
  }

  const response = await fetch(`${apiBaseUrl ?? `${protocol}://${host}`}/api/produse`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as Product[];
}

function buildStats(products: Product[]): DashboardStats {
  const kitchenCategories = new Set<string>(
    PRODUCT_CATEGORY_GROUPS.find((group) => group.title === "PENTRU BUCĂTĂRIE")?.items ?? []
  );
  const bedroomCategories = new Set<string>(
    PRODUCT_CATEGORY_GROUPS.find((group) => group.title === "PENTRU DORMITOR")?.items ?? []
  );
  const livingCategories = new Set<string>(
    PRODUCT_CATEGORY_GROUPS.find((group) => group.title === "PENTRU LIVING")?.items ?? []
  );

  const stats: DashboardStats = {
    total: products.length,
    byCategory: {
      Bucatarie: 0,
      Dormitor: 0,
      Living: 0,
    },
  };

  for (const product of products) {
    if (product.categorie && kitchenCategories.has(product.categorie)) {
      stats.byCategory.Bucatarie += 1;
    } else if (product.categorie && bedroomCategories.has(product.categorie)) {
      stats.byCategory.Dormitor += 1;
    } else if (product.categorie && livingCategories.has(product.categorie)) {
      stats.byCategory.Living += 1;
    }
  }

  return stats;
}

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const stats = buildStats(products);
  const populatedCategories = Object.values(stats.byCategory).filter((value) => value > 0).length;

  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">
            Privire rapidă asupra catalogului și acțiunilor principale.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Gestionează produse
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <Box className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total produse</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <LayoutPanelLeft className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categorii populate</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{populatedCategories}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <Grid2X2 className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Bucătărie</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.byCategory.Bucatarie}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <ClipboardList className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Dormitor + Living</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats.byCategory.Dormitor + stats.byCategory.Living}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Distribuție categorii
          </h3>
          <div className="mt-4 space-y-3">
            {[
              ["Bucătărie", stats.byCategory.Bucatarie],
              ["Dormitor", stats.byCategory.Dormitor],
              ["Living", stats.byCategory.Living],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-700">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Acțiuni rapide</h3>
          <div className="mt-4 grid gap-2">
            <Link
              href="/admin"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Adaugă sau editează produse
            </Link>
            <Link
              href="/admin/comenzi"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Verifică comenzile noi
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
