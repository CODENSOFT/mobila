import type { ProductCategory } from "../constants/categories";

export type { ProductCategory };

export type Product = {
  _id: string;
  nume: string;
  nume_ru?: string;
  descriere: string;
  descriere_ru?: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  slug?: string;
  categorie?: ProductCategory;
  areReducere?: boolean;
  pretReducere?: number;
  procentReducere?: number;
};
