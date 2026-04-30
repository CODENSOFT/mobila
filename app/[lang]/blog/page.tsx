import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale } from "../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.blog;

  return (
    <main className="min-h-[50vh] bg-[#fafaf9] px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-[#1c1917] sm:text-4xl">{t.title}</h1>
        <p className="mt-4 text-gray-600">{t.description}</p>
        <Link
          href={`/${lang}`}
          className="mt-8 inline-flex text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-dark)]"
        >
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
