"use client";

import { FormEvent, useState } from "react";

type ContactFormData = {
  nume: string;
  telefon: string;
  mesaj: string;
};

const initialFormData: ContactFormData = {
  nume: "",
  telefon: "",
  mesaj: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Contact submit failed");
      }

      setFormData(initialFormData);
      setSuccessMessage("Mesajul a fost trimis cu succes!");
    } catch (error) {
      console.error("Eroare la trimiterea formularului:", error);
      alert("Nu am putut trimite mesajul. Incearca din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-5">
      <div className="space-y-1">
        <label htmlFor="contact-nume" className="block text-sm font-medium text-gray-700">
          Nume
        </label>
        <input
          id="contact-nume"
          type="text"
          value={formData.nume}
          onChange={(event) => setFormData({ ...formData, nume: event.target.value })}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-telefon" className="block text-sm font-medium text-gray-700">
          Telefon
        </label>
        <input
          id="contact-telefon"
          type="tel"
          value={formData.telefon}
          onChange={(event) => setFormData({ ...formData, telefon: event.target.value })}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-mesaj" className="block text-sm font-medium text-gray-700">
          Mesaj
        </label>
        <textarea
          id="contact-mesaj"
          value={formData.mesaj}
          onChange={(event) => setFormData({ ...formData, mesaj: event.target.value })}
          className="min-h-32 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
      >
        {isSubmitting ? "Se trimite..." : "Trimite mesaj"}
      </button>

      {successMessage ? <p className="text-sm font-medium text-gray-700">{successMessage}</p> : null}
    </form>
  );
}
