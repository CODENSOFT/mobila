import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline";
};

export default function Button({
  href,
  children,
  className = "",
  variant = "solid",
}: ButtonProps) {
  const base =
    "inline-block rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-105";

  const solid =
    "bg-[var(--brand-green)] text-white shadow-[0_10px_30px_rgba(34,81,12,0.28)] hover:bg-[var(--brand-green-dark)] hover:shadow-[0_16px_36px_rgba(34,81,12,0.34)]";

  const outline =
    "border border-white/40 bg-white/10 text-white backdrop-blur hover:border-white/70 hover:bg-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.18)]";

  return (
    <Link
      href={href}
      className={`${base} ${variant === "outline" ? outline : solid} ${className}`}
    >
      {children}
    </Link>
  );
}
