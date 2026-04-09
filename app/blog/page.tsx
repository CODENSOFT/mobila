import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | LABIRINT",
  description: "Inspirație, sfaturi și tendințe în amenajări cu mobilă LABIRINT.",
};

export default function BlogPage() {
  return (
    <main className="min-h-[50vh] bg-[#fafaf9] px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-[#1c1917] sm:text-4xl">Blog</h1>
        <p className="mt-4 text-gray-600">
          Lista completă de articole este în lucru. Între timp, poți vedea ultimele recomandări pe
          pagina principală.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-dark)]"
        >
          ← Înapoi acasă
        </Link>
      </div>
    </main>
  );
}
