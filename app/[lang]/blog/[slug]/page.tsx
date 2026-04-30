import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale } from "../../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function BlogSlugPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.blog;

  return (
    <main className="min-h-[50vh] bg-[#fafaf9] px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/${lang}/blog`}
          className="text-sm font-medium text-[var(--brand-green)] hover:text-[var(--brand-green-dark)]"
        >
          {t.backBlog}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold capitalize text-[#1c1917] sm:text-4xl">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-6 leading-relaxed text-gray-600">
          {t.articleComingSoon}{" "}
          <Link href={`/${lang}/contact`} className="font-medium text-[var(--brand-green)] underline">
            {t.articleContact}
          </Link>{" "}
          {t.articleContactSuffix}
        </p>
      </div>
    </main>
  );
}
