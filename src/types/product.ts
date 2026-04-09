import type { ProductCategory } from "../constants/categories";

export type { ProductCategory };

export type Product = {
  _id: string;
  nume: string;
  descriere: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  slug?: string;
  categorie?: ProductCategory;
};
