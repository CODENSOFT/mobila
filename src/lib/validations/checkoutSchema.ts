import { z } from "zod";

export const checkoutSchema = z.object({
  prenume: z.string().min(2, "Minim 2 caractere"),
  nume: z.string().min(2, "Minim 2 caractere"),
  email: z.string().email("Email invalid"),
  telefon: z.string().regex(/^(\+373|0)[0-9]{8}$/, "Număr MD invalid"),
  strada: z.string().min(3, "Minim 3 caractere"),
  numar: z.string().min(1, "Obligatoriu"),
  bloc: z.string().optional(),
  scara: z.string().optional(),
  apartament: z.string().optional(),
  oras: z.string().min(2, "Minim 2 caractere"),
  raion: z.string().min(2, "Minim 2 caractere"),
  codPostal: z
    .string()
    .regex(/^(\d{4}|MD-\d{4})$/i, "Cod poștal MD invalid (ex: MD-2001)"),
  metodaLivrare: z.enum(["standard", "express", "showroom"]),
  metodaPlata: z.enum(["card", "ramburs", "transfer"]),
  cardNumber: z.string().optional(),
  cardTitular: z.string().optional(),
  cardExp: z.string().optional(),
  cardCvv: z.string().optional(),
  codReducere: z.string().optional(),
  nota: z.string().optional(),
  gdprAccept: z.boolean().refine((v) => v, { message: "Obligatoriu" }),
  newsletter: z.boolean().default(false),
});

export type CheckoutFormValues = z.input<typeof checkoutSchema>;
