import type { Metadata } from "next";
import HeroSplit from "../src/components/sections/HeroSplit";
import ServiciiSection from "../src/components/sections/ServiciiSection";
import CategoriesSection from "../src/components/sections/CategoriesSection";
import FeaturedProductsSection from "../src/components/sections/FeaturedProductsSection";
import PretScazutSection from "../src/components/sections/PretScazutSection";
import HeroSection from "../src/components/sections/HeroSection";
import Testimoniale from "../src/components/sections/Testimoniale";
import FadeInOnScroll from "../src/components/ui/FadeInOnScroll";
import { getDiscountedProducts, getFeaturedProducts } from "../src/services/products";
import { getDictionary } from "./[lang]/dictionaries";

export const metadata: Metadata = {
  title: "LABIRINT | Mobila la comanda Soroca",
  description: "Mobila la comanda si produse de calitate. Experienta din 2007.",
};

export default async function Home() {
  const [featuredProducts, discountedProducts, dict] = await Promise.all([
    getFeaturedProducts(),
    getDiscountedProducts(),
    getDictionary("ro"),
  ]);
  const s = dict.services;

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <HeroSection
        t={dict.hero}
        productsHref="/ro/produse"
        features={dict.featuresStrip?.items}
      />
      <FadeInOnScroll>
        <CategoriesSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FeaturedProductsSection products={featuredProducts} />
      </FadeInOnScroll>
      <HeroSplit />
      <FadeInOnScroll>
        <PretScazutSection products={discountedProducts} t={dict.pretScazut} lang="ro" />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ServiciiSection
          copyrightQuality={s.quality}
          imageOverlayCaption={s.design}
        />
      </FadeInOnScroll>
      <Testimoniale t={dict.testimonials} />
    </main>
  );
}
