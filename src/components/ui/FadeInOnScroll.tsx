type FadeInOnScrollProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FadeInOnScroll({ children, className = "" }: FadeInOnScrollProps) {
  return <div className={className}>{children}</div>;
}
