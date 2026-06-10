export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { getDictionary, isLocale } from "../../dictionaries";
import { connectDB } from "@/src/lib/db";
import SetModel from "@/src/models/Set";
import ProductModel from "@/src/models/Product";
import SetPageClient, { type SetDoc, type SetProduct } from "@/src/app/[lang]/seturi/[key]/SetPageClient";

async function getSetByKey(key: string): Promise<SetDoc | null> {
  try {
    await connectDB();
    const decoded = decodeURIComponent(key).trim();
    const doc = await SetModel.findOne({ key: decoded }).lean();
    if (!doc) return null;
    return {
      _id: String(doc._id),
      key: doc.key,
      nume: doc.nume,
      nume_ru: doc.nume_ru ?? "",
      descriere: doc.descriere ?? "",
      descriere_ru: doc.descriere_ru ?? "",
      imagine: doc.imagine ?? "",
      imagini: Array.isArray(doc.imagini) ? doc.imagini : [],
    };
  } catch (e) {
    console.error("[getSetByKey]", e);
    return null;
  }
}

async function getProductsInSet(setKey: string): Promise<SetProduct[]> {
  try {
    await connectDB();
    const decoded = decodeURIComponent(setKey).trim();
    const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const docs = await ProductModel.find({
      set: { $regex: `^${escaped}$`, $options: "i" },
    }).lean<Record<string, unknown>[]>();
    return docs.map((d) => ({
      _id: String(d._id),
      nume: String(d.nume ?? ""),
      pret: Number(d.pret ?? 0),
      imagine: String(d.imagine ?? ""),
      areReducere: Boolean(d.areReducere),
      pretReducere: d.pretReducere != null ? Number(d.pretReducere) : undefined,
    }));
  } catch (e) {
    console.error("[getProductsInSet]", e);
    return [];
  }
}

export default async function SetPage({ params }: { params: Promise<{ lang: string; key: string }> }) {
  const { lang, key } = await params;
  if (!isLocale(lang)) notFound();

  const [set, produseInSet, dict] = await Promise.all([
    getSetByKey(key),
    getProductsInSet(key),
    getDictionary(lang),
  ]);

  if (!set) notFound();

  const productDict = dict.product;
  const productsDict = dict.products as { set?: string; productsCount?: string } | undefined;
  const isRu = lang === "ru";
  const t = {
    home: productDict.home,
    products: productDict.products,
    description: productDict.description,
    delivery: productDict.delivery,
    deliveryValue: productDict.deliveryValue,
    warranty: productDict.warranty,
    warrantyValue: productDict.warrantyValue,
    assembly: productDict.assembly,
    assemblyValue: productDict.assemblyValue,
    payment: productDict.payment,
    paymentValue: productDict.paymentValue,
    callNow: productDict.callNow,
    whatsapp: productDict.whatsapp,
    setLabel: productsDict?.set ?? "Set",
    productsOfSet: isRu ? "Товары набора" : "Produsele setului",
    productsCount: productsDict?.productsCount ?? (isRu ? "товаров" : "produse"),
    total: isRu ? "Итого" : "Total",
    addAllToCart: isRu ? "Добавить всё в корзину" : "Adaugă tot în coș",
    addedToCart: isRu ? "Добавлено в корзину" : "Adăugat în coș",
  };

  return <SetPageClient set={set} produseInSet={produseInSet} lang={lang} t={t} />;
}
