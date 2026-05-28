import { notFound } from "next/navigation";

import CategoriesSection from "@/src/components/sections/CategoriesSection";
import FeaturedProductsSection from "@/src/components/sections/FeaturedProductsSection";
import FilialeSection from "@/src/components/sections/FilialeSection";
import PretScazutSection from "@/src/components/sections/PretScazutSection";
import ProduseTopSection from "@/src/components/sections/ProduseTopSection";
import AutoRefresh from "@/src/components/ui/AutoRefresh";
import FadeInOnScroll from "@/src/components/ui/FadeInOnScroll";
import { getDiscountedProducts, getFeaturedProducts, getTopProducts } from "@/src/services/products";
import { getDictionary, isLocale } from "./dictionaries";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [dict, featuredProducts, discountedProducts, topProducts] = await Promise.all([
    getDictionary(lang),
    getFeaturedProducts(),
    getDiscountedProducts(),
    getTopProducts(),
  ]);

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <AutoRefresh />
      <FadeInOnScroll>
        <CategoriesSection t={dict.categories} productsBasePath={`/${lang}/produse`} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <PretScazutSection products={discountedProducts} t={dict.pretScazut} lang={lang} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ProduseTopSection products={topProducts} t={dict.produseTop} lang={lang} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FeaturedProductsSection products={featuredProducts} t={dict.featured} lang={lang} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FilialeSection />
      </FadeInOnScroll>
    </main>
  );
}
