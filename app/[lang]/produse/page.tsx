export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import ProduseClient from "@/app/produse/produse-client";
import { getAllProducts } from "@/src/services/products";
import { isLocale } from "../dictionaries";

export default async function ProdusePage({ params }: PageProps<"/[lang]/produse">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [produse] = await Promise.all([getAllProducts()]);

  return <ProduseClient produse={produse} />;
}
