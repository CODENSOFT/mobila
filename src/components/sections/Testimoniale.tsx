import Image from "next/image";
import { Star } from "lucide-react";

export type TestimonialItem = {
  imagine: string;
  stele: number;
  numarRecenzii: number;
  nume: string;
  citat: string;
  oras: string;
};

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    imagine: "/images/testimonial-1.jpg",
    stele: 5,
    numarRecenzii: 24,
    nume: "Maria Constantin",
    citat: "Mobilier superb, calitate excepțională! Recomand cu încredere.",
    oras: "București",
  },
  {
    imagine: "/images/testimonial-2.jpg",
    stele: 5,
    numarRecenzii: 18,
    nume: "Andrei Popescu",
    citat: "Livrare rapidă, montaj profesional. O experiență de nota 10.",
    oras: "Cluj-Napoca",
  },
  {
    imagine: "/images/testimonial-3.jpg",
    stele: 5,
    numarRecenzii: 31,
    nume: "Elena Ionescu",
    citat: "Design elegant, exact ca în poze. Depășește așteptările.",
    oras: "Timișoara",
  },
];

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {reviews} recenzii
      </span>
    </div>
  );
}

type TestimonialeProps = {
  testimonials?: TestimonialItem[];
};

export default function Testimoniale({
  testimonials = DEFAULT_TESTIMONIALS,
}: TestimonialeProps) {
  return (
    <section className="bg-[#fafaf9]">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2400&auto=format&fit=crop"
          alt="Interior premium cu mobilier modern"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fafaf9]" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 -mt-32 relative z-10 pb-20">
        <div className="bg-white shadow-xl">
          
          {/* Header */}
          <div className="p-8 lg:p-12 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#1c1917]" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
                Testimoniale
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-light text-[#1c1917]">
              Ce spun <span className="italic font-normal">clienții</span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {testimonials.map((t) => (
              <article
                key={t.nume}
                className="p-8 lg:p-10 group hover:bg-[#fafaf9] transition-colors"
              >
                <div className="flex flex-col h-full">
                  {/* Top */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={t.imagine}
                        alt={t.nume}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1c1917] mb-1">
                        {t.nume}
                      </h3>
                      <StarRating rating={t.stele} reviews={t.numarRecenzii} />
                      <p className="text-xs text-gray-400 mt-1">{t.oras}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1">
                    <p className="text-[#57534e] leading-relaxed text-sm lg:text-base">
                      &ldquo;{t.citat}&rdquo;
                    </p>
                  </blockquote>

                  {/* Bottom accent */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Client verificat
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}