"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Package2, ReceiptText } from "lucide-react";

type PanouLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/panou-mobila-2026/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panou-mobila-2026", label: "Produse", icon: Package2 },
  { href: "/panou-mobila-2026/comenzi", label: "Comenzi", icon: ReceiptText },
  {
    href: "/panou-mobila-2026/solicitari-oferte",
    label: "Solicitări oferte",
    icon: FileText,
  },
];

export default function PanouMobilaLayout({ children }: PanouLayoutProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="mb-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Mobila Admin
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Panou de administrare</h1>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Sistem activ
          </span>
        </header>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Navigare
            </p>
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:block lg:space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/panou-mobila-2026" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-xs font-medium transition sm:text-sm lg:justify-start lg:px-3 lg:py-2.5 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
