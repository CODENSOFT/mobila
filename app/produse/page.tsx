import type { Metadata } from "next";
import ProduseClient from "./produse-client";
import { getAllProducts } from "../../src/services/products";

export const metadata: Metadata = {
  title: "LABIRINT | Produse mobilier",
  description: "Produse din catalog si productie proprie LABIRINT pentru Bucatarie, Dormitor, Living si Saltele.",
};

export default async function ProdusePage() {
  const produse = await getAllProducts();

  return <ProduseClient produse={produse} />;
}
