import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Clock, ShieldCheck, Truck } from "lucide-react";

export type ServiciuItem = {
  icon: LucideIcon;
  titlu: string;
  descriere: string;
};

const DEFAULT_SECTION_TITLE = "Cele mai bune servicii ale noastre";

const DEFAULT_SERVICES: ServiciuItem[] = [
  {
    icon: Clock,
    titlu: "Disponibili 24/7",
    descriere:
      "Suntem aici oricând ai nevoie de sfaturi, oferte sau suport pentru comanda ta.",
  },
  {
    icon: Truck,
    titlu: "Livrare gratuită",
    descriere:
      "Transportăm mobilierul până la ușa ta, fără costuri ascunse, în termene clare.",
  },
  {
    icon: ShieldCheck,
    titlu: "Garanție extinsă",
    descriere:
      "Materiale și execuție verificate: beneficiezi de garanție pentru liniștea ta.",
  },
];

const DEFAULT_IMAGE_LEFT_SRC =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop";
const DEFAULT_IMAGE_LEFT_ALT = "Living cu mobilier modern";
const DEFAULT_IMAGE_RIGHT_SRC =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop";
const DEFAULT_IMAGE_RIGHT_ALT = "Interior cu canapea și decor cald";

export type ServiciiSectionProps = {
  sectionTitle?: string;
  services?: ServiciuItem[];
  imageLeftSrc?: string;
  imageLeftAlt?: string;
  imageRightSrc?: string;
  imageRightAlt?: string;
};

export default function ServiciiSection({
  sectionTitle = DEFAULT_SECTION_TITLE,
  services = DEFAULT_SERVICES,
  imageLeftSrc = DEFAULT_IMAGE_LEFT_SRC,
  imageLeftAlt = DEFAULT_IMAGE_LEFT_ALT,
  imageRightSrc = DEFAULT_IMAGE_RIGHT_SRC,
  imageRightAlt = DEFAULT_IMAGE_RIGHT_ALT,
}: ServiciiSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#F5F0E8] py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_1.1fr_1.2fr_1.1fr] lg:gap-8">
          <div className="flex flex-col justify-between py-2 lg:py-0">
            <div>
              <p
                className="mb-5 text-sm uppercase tracking-[0.18em] text-[#8a7f72]"
              >
                De ce noi
              </p>
              <h2
                className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl"
              >
                {sectionTitle}
              </h2>
              <div className="mt-8 flex items-center gap-3">
                <span className="block h-px w-10 bg-[#c9b99a]" />
                <span className="block h-1.5 w-1.5 rounded-full bg-[#c9b99a]" />
              </div>
            </div>
            <p
              className="hidden text-xs tracking-widest text-[#a89e8e] lg:block"
            >
              © {new Date().getFullYear()} · Calitate certificată
            </p>
          </div>

          <div className="relative hidden overflow-hidden rounded-xl lg:block">
            <div className="relative h-full min-h-[440px] w-full">
              <Image
                src={imageLeftSrc}
                alt={imageLeftAlt}
                fill
                priority={false}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1400px) 25vw, 320px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {services.map(({ icon: Icon, titlu, descriere }, index) => (
              <div key={`${titlu}-${index}`}>
                <div className="group flex flex-row items-start gap-5 py-7 transition-all duration-300">
                  <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-lg bg-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                    <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-[#c9b99a] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Icon
                      className="size-[26px] text-[#2a2218] transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <p
                      className="text-base font-medium leading-snug text-[#1a1a1a]"
                    >
                      {titlu}
                    </p>
                    <p
                      className="mt-1.5 text-sm leading-relaxed text-[#6b6257]"
                    >
                      {descriere}
                    </p>
                  </div>
                </div>
                {index < services.length - 1 && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="h-px flex-1 bg-linear-to-r from-transparent via-[#d4c8b5] to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="relative hidden overflow-hidden rounded-xl lg:block">
            <div className="relative h-full min-h-[440px] w-full">
              <Image
                src={imageRightSrc}
                alt={imageRightAlt}
                fill
                priority={false}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1400px) 25vw, 320px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              <div
                className="absolute bottom-5 left-5 rounded-lg bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm"
              >
                <p className="text-xs font-light italic tracking-widest text-[#5c5044]">
                  Design &amp; Confort
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
