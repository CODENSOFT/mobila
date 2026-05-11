import Image from "next/image";
import Button from "../ui/Button";

const HERO_IMAGE = "/images/herolabirint.png";

type Props = {
  t: {
    badge: string;
    heading1: string;
    heading2: string;
    description: string;
    cta: string;
  };
  productsHref: string;
};

export default function HeroSection({ t, productsHref }: Props) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="LABIRINT — mobilă la comandă"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-green)]">
            {t.badge}
          </p>
          <h1 className="text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t.heading1}
            <br />
            <span className="font-serif italic text-[var(--brand-green)]">{t.heading2}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg font-light leading-8 text-white/85">
            {t.description}
          </p>

          <Button
            href={productsHref}
            variant="outline"
            className="mt-10 rounded-none border-[var(--brand-green)] bg-transparent px-10 py-4 font-['Inter'] text-xs uppercase tracking-widest text-[var(--brand-green)] hover:bg-[color:rgba(102,169,37,0.12)] hover:text-[var(--brand-green)]"
          >
            {t.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
