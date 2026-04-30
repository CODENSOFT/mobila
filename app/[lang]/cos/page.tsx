import { notFound } from "next/navigation";
import { isLocale } from "../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function CosPage({ params }: PageProps<"/[lang]/cos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const CosPageClient = (await import("@/app/cos/page")).default;
  return <CosPageClient />;
}
