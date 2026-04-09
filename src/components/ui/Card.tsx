type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  aspect?: "square" | "portrait" | "landscape" | "auto";
};

export default function Card({ 
  children, 
  className = "",
  hover = true,
  aspect = "auto"
}: CardProps) {
  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[16/10]",
    auto: ""
  };

  return (
    <article
      className={`
        group relative overflow-hidden rounded-sm
        bg-[#0a0a0a]
        ${aspectClasses[aspect]}
        ${hover ? "cursor-pointer transition-transform duration-300 hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </article>
  );
}