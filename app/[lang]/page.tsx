import { notFound } from "next/navigation";
import { Clock, ShieldCheck, Truck } from "lucide-react";

import HeroSection from "@/src/components/sections/HeroSection";
import HeroSplit from "@/src/components/sections/HeroSplit";
import CategoriesSection from "@/src/components/sections/CategoriesSection";
import FeaturedProductsSection from "@/src/components/sections/FeaturedProductsSection";
import ServiciiSection from "@/src/components/sections/ServiciiSection";
import Testimoniale from "@/src/components/sections/Testimoniale";
import FadeInOnScroll from "@/src/components/ui/FadeInOnScroll";
import { getFeaturedProducts } from "@/src/services/products";
import { getDictionary, isLocale } from "./dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [dict, featuredProducts] = await Promise.all([
    getDictionary(lang),
    getFeaturedProducts(),
  ]);

  const hs = dict.heroSplit;
  const s = dict.services;

  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      <HeroSection />
      <FadeInOnScroll>
        <CategoriesSection t={dict.categories} productsBasePath={`/${lang}/produse`} />
      </FadeInOnScroll>
      <HeroSplit
        title={hs.title}
        description={hs.description}
        categoriesLinkLabel={hs.viewAll}
        categoriesHref={`/${lang}/produse`}
        tickerMessages={hs.ticker}
      />
      <FadeInOnScroll>
        <FeaturedProductsSection
          products={featuredProducts}
          t={dict.featured}
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
