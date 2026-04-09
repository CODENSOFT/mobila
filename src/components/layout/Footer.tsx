import Link from "next/link";

const footerLinks = {
  produse: [
    { label: "Dormitoare", href: "/produse?categorie=Dormitor" },
    { label: "Bucătării", href: "/produse?categorie=Bucatarii" },
    { label: "Dulapuri", href: "/produse?categorie=Dulapuri" },
    { label: "Scaune", href: "/produse?categorie=Scaune" },
    { label: "Mese", href: "/produse?categorie=Mese" },
  ],
  companie: [
    { label: "Despre noi", href: "/despre" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-xl font-medium tracking-tight">LABIRINT</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">
                Mobilier Premium
              </span>
            </Link>
            
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Mobilier la comandă și produse finite, cu tradiție din 2007. 
              Fiecare piesă este realizată cu atenție la detalii în atelierul nostru din Soroca.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {["Facebook", "Instagram"].map((social) => (
                <a
                  key={social}
                  href={`https://${social.toLowerCase()}.com/labirint`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Produse
            </h4>
            <ul className="space-y-3">
              {footerLinks.produse.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Companie
            </h4>
            <ul className="space-y-3">
              {footerLinks.companie.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <a 
                href="tel:+37369727444"
                className="block text-lg font-light text-white hover:text-white/80 transition-colors"
              >
                +373 697 27 444
              </a>
              <a 
                href="mailto:Labirint.info@mail.ru"
                className="block text-sm text-white/60 hover:text-white transition-colors"
              >
                Labirint.info@mail.ru
              </a>
              <p className="text-sm text-white/60 leading-relaxed">
                Soroca, str. Bechir 4<br />
                Republica Moldova
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} LABIRINT | SRL GASNASGRUP
            </p>
            <div className="text-xs text-white/40">labirint.md</div>
          </div>
        </div>
      </div>
    </footer>
  );
}