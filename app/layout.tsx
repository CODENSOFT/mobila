import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWidget from "./components/chat-widget";
import Footer from "../src/components/layout/Footer";
import Navbar from "../src/components/layout/Navbar";
import CartDrawer from "../src/components/cart/CartDrawer";
import CartToast from "../src/components/cart/CartToast";
import { CartProvider } from "../src/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LABIRINT | Mobila la comanda Soroca",
  description: "Mobila la comanda si produse de calitate. Experienta din 2007.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <CartToast />
          <div className="flex-1">{children}</div>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
