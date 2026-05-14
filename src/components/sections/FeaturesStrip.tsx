import { Award, Ruler, ShieldCheck, TreePine, Truck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FeaturesStripItem = {
  title: string;
  subtitle: string;
};

export type FeaturesStripDict = {
  items: FeaturesStripItem[];
};

const DEFAULT_ITEMS: FeaturesStripItem[] = [
  { title: "Materiale naturale de calitate", subtitle: "Lemn masiv, MDF premium" },
  { title: "Dimensiuni personalizate", subtitle: "Adaptate spațiului tău" },
  { title: "Garanție 24 luni", subtitle: "Reparații gratuite" },
  { title: "Livrare în toată Moldova", subtitle: "Orașe și sate" },
  { title: "Montaj profesional inclus", subtitle: "Echipă specializată" },
  { title: "Producție din 2007", subtitle: "Atelier propriu Soroca" },
];

const ICONS: LucideIcon[] = [TreePine, Ruler, ShieldCheck, Truck, Wrench, Award];

export default function FeaturesStrip({
  items = DEFAULT_ITEMS,
}: {
  items?: FeaturesStripItem[];
}) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
        <ul className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-2 lg:gap-x-4">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? Award;
            const visibleOnMobile = index >= 2 && index <= 4;
            return (
              <li
                key={item.title}
                className={`group relative flex flex-col items-center text-center ${
                  visibleOnMobile ? "" : "hidden md:flex"
                }`}
              >
                <span className="relative mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.04] transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--brand-green)] group-hover:bg-[color:rgba(102,169,37,0.15)] group-hover:shadow-[0_0_24px_rgba(102,169,37,0.4)] lg:h-14 lg:w-14">
                  <Icon
                    className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-[var(--brand-green)] lg:h-6 lg:w-6"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="block text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-white lg:text-[11px]">
                  {item.title}
                </span>
                <span className="mt-1 block text-[10px] font-light leading-snug text-white/55 lg:text-[11px]">
                  {item.subtitle}
                </span>
                {index < items.length - 1 ? (
                  <span className="pointer-events-none absolute right-0 top-3 hidden h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-white/12 to-transparent md:block lg:top-4 lg:h-16" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
