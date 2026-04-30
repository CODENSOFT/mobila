import { notFound } from "next/navigation";
import { isLocale } from "../../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function ConfirmarePage({ params }: PageProps<"/[lang]/checkout/confirmare">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const ConfirmarePageClient = (await import("@/app/checkout/confirmare/page")).default;
  return <ConfirmarePageClient />;
}
