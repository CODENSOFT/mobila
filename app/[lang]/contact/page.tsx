import { notFound } from "next/navigation";
import ContactForm from "@/app/components/contact-form";
import ContactSection from "@/src/components/sections/ContactSection";
import { isLocale } from "../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main className="bg-[#f7f3ec]">
      <ContactSection showForm form={<ContactForm />} />
    </main>
  );
}
