import { getDictionary } from "../[lang]/dictionaries";
import { LangProvider } from "@/src/context/LangContext";

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary("ro");
  return <LangProvider lang="ro" dict={dict}>{children}</LangProvider>;
}
