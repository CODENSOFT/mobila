import Image from "next/image";
import Button from "../ui/Button";

const HERO_IMAGE =
  "https://draperandkramer.com/wp-content/uploads/2022/04/insights-exploring-interior-design-trends-textured-furniture-draperandkramer_20220427_header-image.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Interior premium"
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
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[color:rgba(194,235,162,0.95)]">
            LABIRINT
          </p>
          <h1 className="text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Mobilă la comandă
            <br />
            <span className="font-serif italic text-[color:rgba(214,246,184,0.98)]">de încredere</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg font-light leading-8 text-white/85">
            Din 2007 oferim produse de calitate, garantii reale si mobilier personalizat, cu accent
            pe satisfactia fiecarui client.
          </p>

          <Button
            href="/produse"
            variant="outline"
            className="mt-10 rounded-none border-[var(--brand-green)] bg-transparent px-10 py-4 font-['Inter'] text-xs uppercase tracking-widest text-[var(--brand-green)] hover:bg-[color:rgba(102,169,37,0.12)] hover:text-[var(--brand-green)]"
          >
            Descoperă Colecția
          </Button>
        </div>
      </div>
    </section>
  );
}