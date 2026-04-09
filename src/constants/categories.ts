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
