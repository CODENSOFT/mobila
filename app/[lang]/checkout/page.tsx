import { notFound } from "next/navigation";
import { isLocale } from "../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function CheckoutPage({ params }: PageProps<"/[lang]/checkout">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const CheckoutPageClient = (await import("@/app/checkout/page")).default;
  return <CheckoutPageClient />;
}
