import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import CategoriesSection from "../src/components/sections/CategoriesSection";
import FeaturedProductsSection from "../src/components/sections/FeaturedProductsSection";
import HeroSection from "../src/components/sections/HeroSection";
import PretScazutSection from "../src/components/sections/PretScazutSection";
import ProduseTopSection from "../src/components/sections/ProduseTopSection";
import AutoRefresh from "../src/components/ui/AutoRefresh";
import FadeInOnScroll from "../src/components/ui/FadeInOnScroll";
import { getDiscountedProducts, getFeaturedProducts, getTopProducts } from "../src/services/products";
import { getDictionary } from "./[lang]/dictionaries";

export const metadata: Metadata = {
  title: "LABIRINT | Mobila la comanda Soroca",
  description: "Mobila la comanda si produse de calitate. Experienta din 2007.",
};

export default async function Home() {
  const [featuredProducts, discountedProducts, topProducts, dict] = await Promise.all([
    getFeaturedProducts(),
    getDiscountedProducts(),
    getTopProducts(),
    getDictionary("ro"),
  ]);

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <AutoRefresh />
      <HeroSection t={dict.hero} productsHref="/ro/produse" />
      <FadeInOnScroll>
        <CategoriesSection t={dict.categories} productsBasePath="/ro/produse" />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ProduseTopSection products={topProducts} t={dict.produseTop} lang="ro" />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FeaturedProductsSection products={featuredProducts} t={dict.featured} lang="ro" />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <PretScazutSection products={discountedProducts} t={dict.pretScazut} lang="ro" />
      </FadeInOnScroll>
    </main>
  );
}
