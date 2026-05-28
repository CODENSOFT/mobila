export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import ChatWidget from "@/app/components/chat-widget";
import CartDrawer from "@/src/components/cart/CartDrawer";
import CartToast from "@/src/components/cart/CartToast";
import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import NavbarSpacer from "@/src/components/layout/NavbarSpacer";
import { CartProvider } from "@/src/context/CartContext";
import { LangProvider } from "@/src/context/LangContext";
import LangGuard from "@/src/components/ui/LangGuard";
import { getDictionary, isLocale } from "./dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]"> & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <LangProvider lang={lang} dict={dict}>
      <LangGuard />
      <CartProvider>
        <Navbar />
        <CartDrawer />
        <CartToast />
        <NavbarSpacer />
        <div className="flex-1">{children}</div>
        <Footer />
        <ChatWidget />
      </CartProvider>
    </LangProvider>
  );
}
