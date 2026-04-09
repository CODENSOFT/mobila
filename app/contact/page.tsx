import type { Metadata } from "next";

import ContactForm from "../components/contact-form";
import ContactSection from "../../src/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact LABIRINT | Mobila la comanda Soroca",
  description:
    "Contacteaza LABIRINT pentru mobilier la comanda, produse gata realizate si consultanta.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#f7f3ec]">
      <ContactSection showForm form={<ContactForm />} />
    </main>
  );
}
