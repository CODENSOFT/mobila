import type { Metadata } from "next";
import HeroSplit from "../src/components/sections/HeroSplit";
import ServiciiSection from "../src/components/sections/ServiciiSection";
import CategoriesSection from "../src/components/sections/CategoriesSection";
import FeaturedProductsSection from "../src/components/sections/FeaturedProductsSection";
import HeroSection from "../src/components/sections/HeroSection";
import Testimoniale from "../src/components/sections/Testimoniale";
import FadeInOnScroll from "../src/components/ui/FadeInOnScroll";
import { getFeaturedProducts } from "../src/services/products";

export const metadata: Metadata = {
  title: "LABIRINT | Mobila la comanda Soroca",
  description: "Mobila la comanda si produse de calitate. Experienta din 2007.",
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <HeroSection />
      <FadeInOnScroll>
        <CategoriesSection />
      </FadeInOnScroll>
      <HeroSplit />
      <FadeInOnScroll>
        <FeaturedProductsSection products={featuredProducts} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ServiciiSection />
      </FadeInOnScroll>
      <Testimoniale />
    </main>
  );
}
