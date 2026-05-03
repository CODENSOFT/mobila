export const PRODUCT_CATEGORY_GROUPS = [
  {
    title: "PENTRU DORMITOR",
    items: [
      "Dormitoare",
      "Dulapuri",
      "Paturi",
      "Comode",
      "Noptiere",
      "Anexe",
      "Mese de toaletă",
      "Mese de calculator",
      "Taburete puf",
      "Oglinzi",
    ],
  },
  {
    title: "SALTELE ȘI TOPPERE",
    items: ["Toate saltelele", "Saltele", "Toppere"],
  },
  {
    title: "PENTRU BUCĂTĂRIE",
    items: ["Bucătării", "Colțare", "Mese", "Scaune"],
  },
  {
    title: "PENTRU LIVING",
    items: ["Livinguri", "Dulapuri", "Comode", "Polițe", "Mese", "Scaune", "Mese de cafea"],
  },
  {
    title: "PENTRU HOL",
    items: ["Antreuri", "Dulapuri", "Comode", "Anexe", "Oglinzi", "Pantofare", "Cuiere"],
  },
] as const;

export const PRODUCT_CATEGORIES = [
  "Dormitoare",
  "Dulapuri",
  "Paturi",
  "Comode",
  "Noptiere",
  "Anexe",
  "Mese de toaletă",
  "Mese de calculator",
  "Taburete puf",
  "Oglinzi",
  "Toate saltelele",
  "Saltele",
  "Toppere",
  "Bucătării",
  "Colțare",
  "Mese",
  "Scaune",
  "Livinguri",
  "Polițe",
  "Mese de cafea",
  "Antreuri",
  "Pantofare",
  "Cuiere",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const GROUP_TITLES = {
  dormitor: "PENTRU DORMITOR",
  bucatarie: "PENTRU BUCĂTĂRIE",
} as const;

/** Toate subcategoriile din secțiunea „PENTRU DORMITOR” (folosit la filtrare mega-card). */
export function getCategoriesForDormitorGroup(): readonly ProductCategory[] {
  const g = PRODUCT_CATEGORY_GROUPS.find((x) => x.title === GROUP_TITLES.dormitor);
  return (g?.items ?? []) as readonly ProductCategory[];
}

/** Toate subcategoriile din secțiunea „PENTRU BUCĂTĂRIE”. */
export function getCategoriesForBucatarieGroup(): readonly ProductCategory[] {
  const g = PRODUCT_CATEGORY_GROUPS.find((x) => x.title === GROUP_TITLES.bucatarie);
  return (g?.items ?? []) as readonly ProductCategory[];
}
