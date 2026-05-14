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

export type TestimonialsDict = {
  label: string;
  headingLead: string;
  headingEm: string;
  reviewsTemplate: string;
  verified: string;
  imageAlt: string;
  entries: TestimonialItem[];
};

const RO_FALLBACK: TestimonialsDict = {
  label: "TESTIMONIALE",
  headingLead: "Ce spun",
  headingEm: "clienții",
  reviewsTemplate: "{count} recenzii",
  verified: "CLIENT VERIFICAT",
  imageAlt: "Interior premium cu mobilier modern",
  entries: [
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
  ],
};

function StarRating({
  rating,
  reviews,
  reviewsTemplate,
}: {
  rating: number;
  reviews: number;
  reviewsTemplate: string;
}) {
  const reviewsLabel = reviewsTemplate.replace(
    "{count}",
    String(reviews),
  );
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
      <span className="text-xs text-gray-500">{reviewsLabel}</span>
    </div>
  );
}

type TestimonialeProps = {
  t?: TestimonialsDict;
};

export default function Testimoniale({ t }: TestimonialeProps) {
  const d = t ?? RO_FALLBACK;

  return (
    <section className="bg-[#fafaf9]">
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2400&auto=format&fit=crop"
          alt={d.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#fafaf9]" />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 -mt-32 relative z-10 pb-20">
        <div className="bg-white shadow-xl">
          <div className="p-8 lg:p-12 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#1c1917]" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
                {d.label}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-light text-[#1c1917]">
              {d.headingLead}{" "}
              <span className="italic font-normal">{d.headingEm}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {d.entries.map((entry, index) => (
              <article
                key={`${entry.nume}-${index}`}
                className="p-8 lg:p-10 group hover:bg-[#fafaf9] transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={entry.imagine}
                        alt={entry.nume}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1c1917] mb-1">
                        {entry.nume}
                      </h3>
                      <StarRating
                        rating={entry.stele}
                        reviews={entry.numarRecenzii}
                        reviewsTemplate={d.reviewsTemplate}
                      />
                      <p className="text-xs text-gray-400 mt-1">{entry.oras}</p>
                    </div>
                  </div>

                  <blockquote className="flex-1">
                    <p className="text-[#57534e] leading-relaxed text-sm lg:text-base">
                      &ldquo;{entry.citat}&rdquo;
                    </p>
                  </blockquote>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {d.verified}
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
