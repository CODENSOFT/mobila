import { getDictionary } from "../[lang]/dictionaries";
import { CartProvider } from "@/src/context/CartContext";
import { LangProvider } from "@/src/context/LangContext";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary("ro");
  return (
    <LangProvider lang="ro" dict={dict}>
      <CartProvider>{children}</CartProvider>
    </LangProvider>
  );
}
