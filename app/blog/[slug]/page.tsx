import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Articol | LABIRINT`,
    description: `Articol blog: ${slug.replace(/-/g, " ")}`,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-[50vh] bg-[#fafaf9] px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-[var(--brand-green)] hover:text-[var(--brand-green-dark)]"
        >
          ← Blog
        </Link>
        <h1 className="mt-6 text-3xl font-semibold capitalize text-[#1c1917] sm:text-4xl">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-6 text-gray-600 leading-relaxed">
          Conținutul complet al acestui articol va fi publicat în curând. Revino sau{" "}
          <Link href="/contact" className="font-medium text-[var(--brand-green)] underline">
            contactează-ne
          </Link>{" "}
          pentru detalii.
        </p>
      </div>
    </main>
  );
}
