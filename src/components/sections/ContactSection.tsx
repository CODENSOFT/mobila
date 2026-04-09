type ContactSectionProps = {
  showForm?: boolean;
  form?: React.ReactNode;
};

export default function ContactSection({ showForm = false, form }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-[#fafaf9]">
      {/* Header */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-[#1c1917]/20" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
                Contact
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-light text-[#1c1917] leading-tight">
              Să începem un <span className="italic font-normal">proiect</span>
            </h1>
            <p className="mt-6 text-lg text-[#78716c] leading-relaxed">
              Fie că ai nevoie de mobilier la comandă sau dorești să vizitezi showroom-ul, 
              suntem aici să te ajutăm.
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left - Contact Info */}
          <div className="space-y-12">
            
            {/* Phone */}
            <div className="group">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                Telefon
              </h3>
              <a 
                href="tel:+37369727444" 
                className="text-2xl lg:text-3xl font-light text-[#1c1917] hover:text-[#78716c] transition-colors"
              >
                +373 697 27 444
              </a>
              <p className="mt-2 text-sm text-[#a8a29e]">
                Luni - Vineri, 09:00 - 18:00
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                Email
              </h3>
              <a 
                href="mailto:info@labirint.md" 
                className="text-xl lg:text-2xl font-light text-[#1c1917] hover:text-[#78716c] transition-colors"
              >
                info@labirint.md
              </a>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                Showroom & Atelier
              </h3>
              <p className="text-xl lg:text-2xl font-light text-[#1c1917] leading-relaxed">
                Soroca, strada Bechir 4
              </p>
              <p className="mt-2 text-sm text-[#a8a29e]">
                Republica Moldova
              </p>
            </div>

            {/* Social */}
            <div className="pt-8 border-t border-[#e7e5e4]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-6">
                Urmărește-ne
              </h3>
              <div className="flex items-center gap-4">
                {[
                  { name: "Facebook", href: "https://facebook.com/labirint" },
                  { name: "Instagram", href: "https://instagram.com/labirint" },
                  { name: "Telegram", href: "https://t.me/labirint" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-[#e7e5e4] text-sm text-[#57534e] hover:border-[#1c1917] hover:text-[#1c1917] transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] bg-[#e7e5e4]">
              <iframe
                title="LABIRINT Soroca"
                src="https://www.google.com/maps?q=Soroca%20Strada%20Bechir%204&output=embed"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            <p className="text-sm text-[#a8a29e] text-center">
              Click pe hartă pentru indicații în Google Maps
            </p>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mt-20 lg:mt-24 pt-16 lg:pt-20 border-t border-[#e7e5e4]">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-light text-[#1c1917]">
                Solicită o ofertă
              </h2>
              <p className="mt-3 text-[#78716c]">
                Completează formularul și te contactăm în 24 de ore.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              {form}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}