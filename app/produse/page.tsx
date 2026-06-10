// ISR: regenerate this page in the background every 30s — repeat visits hit the
// cache instantly while still picking up new products within seconds.
export const revalidate = 30;

import type { Metadata } from "next";

import { connectDB } from "@/src/lib/db";
import CustomCategory from "@/src/models/CustomCategory";
import SetModel from "@/src/models/Set";

import ProduseClient from "./produse-client";
import { getAllProducts } from "../../src/services/products";

export const metadata: Metadata = {
  title: "LABIRINT | Produse mobilier",
  description: "Produse din catalog si productie proprie LABIRINT pentru Bucatarie, Dormitor, Living si Saltele.",
};

// Server-side fetch of categories and sets so client doesn't need to wait for
// a hydration-time API call before rendering the sidebar / set cards.
async function getInitialCategories() {
  try {
    await connectDB();
    const docs = await CustomCategory.find().sort({ grup: 1, ordine: 1, label: 1 }).lean();
    return docs.map((d) => ({
      _id: String(d._id),
      key: d.key,
      label: d.label,
      grup: d.grup,
      hidden: Boolean(d.hidden),
      ordine: typeof d.ordine === "number" ? d.ordine : 0,
    }));
  } catch {
    return [];
  }
}

async function getInitialSets() {
  try {
    await connectDB();
    const docs = await SetModel.find().select("key nume imagine").lean();
    return docs.map((d) => ({
      key: d.key,
      nume: d.nume,
      imagine: typeof d.imagine === "string" ? d.imagine : "",
    }));
  } catch {
    return [];
  }
}

export default async function ProdusePage() {
  const [produse, initialCategories, initialSets] = await Promise.all([
    getAllProducts(),
    getInitialCategories(),
    getInitialSets(),
  ]);

  return (
    <ProduseClient
      produse={produse}
      initialCategories={initialCategories}
      initialSets={initialSets}
    />
  );
}
