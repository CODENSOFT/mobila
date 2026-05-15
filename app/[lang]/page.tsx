import { notFound } from "next/navigation";
import { Clock, ShieldCheck, Truck } from "lucide-react";

import HeroSection from "@/src/components/sections/HeroSection";
import CategoriesSection from "@/src/components/sections/CategoriesSection";
import FeaturedProductsSection from "@/src/components/sections/FeaturedProductsSection";
import PretScazutSection from "@/src/components/sections/PretScazutSection";
import ProduseTopSection from "@/src/components/sections/ProduseTopSection";
import ServiciiSection from "@/src/components/sections/ServiciiSection";
import Testimoniale from "@/src/components/sections/Testimoniale";
import FadeInOnScroll from "@/src/components/ui/FadeInOnScroll";
import { getDiscountedProducts, getFeaturedProducts, getTopProducts } from "@/src/services/products";
import AutoRefresh from "@/src/components/ui/AutoRefresh";
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

  const s = dict.services;

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <AutoRefresh />
      <HeroSection
        t={dict.hero}
        productsHref={`/${lang}/produse`}
        features={dict.featuresStrip?.items}
      />
      <FadeInOnScroll>
        <CategoriesSection t={dict.categories} productsBasePath={`/${lang}/produse`} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ProduseTopSection
          products={topProducts}
          lang={lang}
        />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <FeaturedProductsSection
          products={featuredProducts}
          t={dict.featured}
          lang={lang}
        />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <PretScazutSection
          products={discountedProducts}
          t={dict.pretScazut}
          lang={lang}
        />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ServiciiSection
          badge={s.badge}
          sectionTitle={s.heading}
          services={s.items.map((item, i) => ({
            icon: [Clock, Truck, ShieldCheck][i] ?? Clock,
            titlu: item.title,
            descriere: item.desc,
          }))}
          copyrightQuality={s.quality}
          imageOverlayCaption={s.design}
        />
      </FadeInOnScroll>
      <Testimoniale t={dict.testimonials} />
    </main>
  );
}
