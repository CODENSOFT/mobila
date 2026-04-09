import Image from "next/image";
import Link from "next/link";
import Card from "../ui/Card";

const categories = [
  {
    title: "Dormitor",
    subtitle: "Relaxare & Confort",
    image: "/images/categories/dormitor.png",
    size: "large"
  },
  {
    title: "Bucatarii",
    subtitle: "Functionalitate & Stil",
    image: "/images/categories/bucatarii.png",
    size: "medium"
  },
  {
    title: "Dulapuri",
    subtitle: "Spatiu & Organizare",
    image: "/images/categories/dulapuri.png",
    size: "medium"
  },
  {
    title: "Scaune",
    subtitle: "Confort & Design",
    image: "/images/categories/scaune.png",
    size: "small"
  },
  {
    title: "Mese",
    subtitle: "Calitate & Utilitate",
    image: "/images/categories/mese.png",
    size: "small"
  },
];

export default function CategoriesSection() {
  return (
    <section className="relative overflow-hidden bg-[#fafaf9] py-24 lg:py-32">
      {/* Subtle ambient gradients */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-linear-to-bl from-[#e8f5e0]/40 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-linear-to-tr from-[#f0f7eb]/60 via-transparent to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Editorial Header */}
        <div className="mb-16 lg:mb-24 text-left">
          <h2 className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl">
            Discover more for you
          </h2>
        </div>

        {/* Premium Editorial Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          
          {/* Featured - Dormitor (spans 7 cols, 2 rows) */}
          <Card className="group relative col-span-12 lg:col-span-7 lg:row-span-2 h-[500px] lg:h-[700px] overflow-hidden rounded-sm bg-[#1c1917]">
            <Link
              href="/produse?categorie=Dormitor"
              aria-label="Vezi produse din categoria Dormitor"
              className="absolute inset-0 z-20"
            />
            <Image
              src={categories[0].image}
              alt={categories[0].title}
              fill
              className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/90 via-[#0c0c0c]/20 to-transparent" />
            
            {/* Premium indicator */}
            <div className="absolute left-6 top-6 lg:left-10 lg:top-10">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <div className="h-1.5 w-1.5 rounded-full bg-[#c2eba2] animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                  Premium
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
              <div className="max-w-lg">
                <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/50">
                  {categories[0].subtitle}
                </p>
                <h3 className="mb-6 text-3xl font-light text-white lg:text-5xl">
                  {categories[0].title}
                </h3>
                <div className="flex items-center gap-4 text-white/80 transition-all duration-500 group-hover:gap-6">
                  <span className="text-xs font-medium uppercase tracking-[0.15em]">
                    Explorează colecția
                  </span>
                  <div className="h-px w-8 bg-[#c2eba2] transition-all duration-500 group-hover:w-12" />
                  <svg 
                    className="h-4 w-4 text-[#c2eba2] transition-transform duration-500 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          {/* Bucatarii - Top Right (spans 5 cols) */}
          <Card className="group relative col-span-12 lg:col-span-5 h-[300px] lg:h-[340px] overflow-hidden rounded-sm bg-[#1c1917]">
            <Link
              href="/produse?categorie=Bucatarii"
              aria-label="Vezi produse din categoria Bucatarii"
              className="absolute inset-0 z-20"
            />
            <Image
              src={categories[1].image}
              alt={categories[1].title}
              fill
              className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                {categories[1].subtitle}
              </p>
              <h3 className="mb-4 text-2xl font-light text-white">
                {categories[1].title}
              </h3>
              <div className="flex items-center gap-3 text-[#c2eba2] opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="text-[10px] uppercase tracking-[0.15em]">Vezi</span>
                <div className="h-px w-6 bg-current" />
              </div>
            </div>
          </Card>

          {/* Dulapuri - Middle Right (spans 5 cols) */}
          <Card className="group relative col-span-12 lg:col-span-5 h-[300px] lg:h-[340px] overflow-hidden rounded-sm bg-[#1c1917]">
            <Link
              href="/produse?categorie=Dulapuri"
              aria-label="Vezi produse din categoria Dulapuri"
              className="absolute inset-0 z-20"
            />
            <Image
              src={categories[2].image}
              alt={categories[2].title}
              fill
              className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                {categories[2].subtitle}
              </p>
              <h3 className="mb-4 text-2xl font-light text-white">
                {categories[2].title}
              </h3>
              <div className="flex items-center gap-3 text-[#c2eba2] opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="text-[10px] uppercase tracking-[0.15em]">Vezi</span>
                <div className="h-px w-6 bg-current" />
              </div>
            </div>
          </Card>

          {/* Bottom Row - Scaune & Mese */}
          <Card className="group relative col-span-6 lg:col-span-4 h-[260px] lg:h-[300px] overflow-hidden rounded-sm bg-[#1c1917]">
            <Link
              href="/produse?categorie=Scaune"
              aria-label="Vezi produse din categoria Scaune"
              className="absolute inset-0 z-20"
            />
            <Image
              src={categories[3].image}
              alt={categories[3].title}
              fill
              className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                {categories[3].subtitle}
              </p>
              <h3 className="text-xl font-light text-white mb-3">
                {categories[3].title}
              </h3>
              <div className="flex items-center gap-2 text-[#c2eba2] opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="h-px w-4 bg-current" />
              </div>
            </div>
          </Card>

          <Card className="group relative col-span-6 lg:col-span-4 h-[260px] lg:h-[300px] overflow-hidden rounded-sm bg-[#1c1917]">
            <Link
              href="/produse?categorie=Mese"
              aria-label="Vezi produse din categoria Mese"
              className="absolute inset-0 z-20"
            />
            <Image
              src={categories[4].image}
              alt={categories[4].title}
              fill
              className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                {categories[4].subtitle}
              </p>
              <h3 className="text-xl font-light text-white mb-3">
                {categories[4].title}
              </h3>
              <div className="flex items-center gap-2 text-[#c2eba2] opacity-0 transition-all duration-500 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="h-px w-4 bg-current" />
              </div>
            </div>
          </Card>

          {/* Stats/CTA Card */}
          <Card className="group relative col-span-12 lg:col-span-4 h-[260px] lg:h-[300px] overflow-hidden rounded-sm bg-[#1c1917] flex flex-col justify-between p-6 lg:p-8 cursor-pointer hover:bg-[#1c1917]/95 transition-colors duration-500">
            <Link
              href="/produse"
              aria-label="Vezi toata colectia de produse"
              className="absolute inset-0 z-20"
            />
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#66a925] mb-2">Nou</div>
              <h3 className="text-2xl font-light text-white mb-2">Colecția completă</h3>
              <p className="text-sm text-white/50 leading-relaxed">150+ piese de mobilier premium</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-white/70">Vezi tot</span>
              <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#66a925] group-hover:bg-[#66a925] transition-all duration-300">
                <svg 
                  className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}