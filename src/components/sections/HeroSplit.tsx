import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Armchair, Lamp, Sofa, Table } from "lucide-react";

export type HeroSplitCategory = {
  name: string;
  icon: LucideIcon;
};

const DEFAULT_TITLE =
  "Designuri de calitate premium, create pentru casa ta";

const DEFAULT_DESCRIPTION =
  "Alege piese care îmbină confortul cu estetica: materiale naturale, finisaje atent alese și proporții echilibrate pentru un interior care te reprezintă.";

const DEFAULT_CATEGORIES: HeroSplitCategory[] = [
  { name: "Chair", icon: Armchair },
  { name: "Lamp", icon: Lamp },
  { name: "Sofa", icon: Sofa },
  { name: "Table", icon: Table },
];

const DEFAULT_TICKER_MESSAGES = [
  "Mobilă de peste 500 MDL",
  "Stiluri eclectice și materiale naturale",
  "Design clasic cu detalii rafinate",
  "Cele mai bune oferte și furnizori de încredere",
];

const DEFAULT_IMAGE_SRC =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop";

const DEFAULT_IMAGE_ALT = "Mobilier modern în living";

export type HeroSplitProps = {
  title?: string;
  description?: string;
  categoriesLinkLabel?: string;
  categoriesHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  categories?: HeroSplitCategory[];
  tickerMessages?: string[];
};

export default function HeroSplit({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  categoriesLinkLabel = "VEZI TOATE CATEGORIILE",
  categoriesHref = "/produse",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
  categories = DEFAULT_CATEGORIES,
  tickerMessages = DEFAULT_TICKER_MESSAGES,
}: HeroSplitProps) {
  const band = [...tickerMessages, ...tickerMessages];

  return (
    <section className="flex min-h-screen w-full flex-col bg-[#F5F0E8]">
      <div className="flex min-h-[min(100dvh,90vh)] flex-1 flex-col lg:min-h-[90vh] lg:flex-row lg:items-stretch">
        <div className="relative h-[45vh] w-full shrink-0 lg:h-auto lg:min-h-[90vh] lg:w-1/2 lg:min-w-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div
          className="flex w-full flex-col justify-between px-8 py-12 lg:min-h-[90vh] lg:w-1/2 lg:px-16 lg:py-20"
          style={{ backgroundColor: "#F5F0E8" }}
        >
          <div>
            <h2 className="text-left text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#666]">
              {description}
            </p>
            <Link
              href={categoriesHref}
              className="mt-8 inline-block border-b border-solid border-[#1a1a1a] text-xs font-medium uppercase tracking-[0.2em] text-[#1a1a1a] transition-opacity hover:opacity-60"
            >
              {categoriesLinkLabel}
              <span className="ml-1" aria-hidden>
                →
              </span>
            </Link>

            <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <Link
                    href={categoriesHref}
                    className="flex flex-col items-center rounded-md border border-[#ddd] bg-white px-3 py-4 text-center transition-shadow hover:border-[#bbb] hover:shadow-sm sm:rounded-lg sm:px-4 sm:py-5"
                  >
                    <Icon
                      className="size-8 text-[#1a1a1a] sm:size-9"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <span className="mt-3 text-sm font-medium text-[#1a1a1a]">
                      {name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden bg-[#111] py-3 text-white">
        <div className="hero-split-marquee-track">
          {band.map((msg, i) => (
            <span
              key={`${msg}-${i}`}
              className="flex shrink-0 items-center gap-4 whitespace-nowrap px-6 text-xs font-medium uppercase tracking-[0.2em]"
            >
              <span>{msg}</span>
              <span aria-hidden className="text-base">
                ⚡
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
