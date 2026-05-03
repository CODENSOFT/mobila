import { z } from "zod";

/** Trim string fields from the form (empty string when missing). */
const trimmed = z.preprocess(
  (v) => (v == null ? "" : String(v).trim()),
  z.string()
);

/** Checkbox HTML: bifat = true sau „on”; nebifat = false / undefined. */
const fromCheckbox = (v: unknown) => v === true || v === "on";

export const checkoutSchema = z
  .object({
    prenume: z.string().min(2, "Minim 2 caractere"),
    nume: z.string().min(2, "Minim 2 caractere"),
    email: z.string().email("Email invalid"),
    telefon: z.preprocess(
      (v) => (v == null ? "" : String(v).replace(/\s/g, "")),
      z.string().regex(/^(\+373|0)[0-9]{8}$/, "Număr MD invalid")
    ),
    strada: trimmed,
    numar: trimmed,
    bloc: trimmed,
    scara: trimmed,
    apartament: trimmed,
    oras: trimmed,
    raion: trimmed,
    codPostal: trimmed,
    metodaLivrare: z.enum(["standard", "express", "showroom"]),
    metodaPlata: z.enum(["card", "ramburs", "transfer"]),
    cardNumber: z.string().optional(),
    cardTitular: z.string().optional(),
    cardExp: z.string().optional(),
    cardCvv: z.string().optional(),
    nota: z.string().optional(),
    gdprAccept: z.preprocess((v) => fromCheckbox(v), z.boolean()).refine((v) => v, { message: "Obligatoriu" }),
    newsletter: z.preprocess((v) => fromCheckbox(v), z.boolean()).default(false),
  })
  .superRefine((data, ctx) => {
    const parts = [data.strada, data.numar, data.oras, data.raion, data.codPostal];
    const anyFilled = parts.some((p) => p.length > 0);
    const allFilled = parts.every((p) => p.length > 0);

    if (!anyFilled) {
      return;
    }

    if (!allFilled) {
      ctx.addIssue({
        code: "custom",
        message: "Completează toate câmpurile adresei sau lasă-le goale.",
        path: ["strada"],
      });
      return;
    }

    if (data.strada.length < 3) {
      ctx.addIssue({ code: "custom", message: "Minim 3 caractere", path: ["strada"] });
    }
    if (!data.numar.length) {
      ctx.addIssue({ code: "custom", message: "Obligatoriu", path: ["numar"] });
    }
    if (data.oras.length < 2) {
      ctx.addIssue({ code: "custom", message: "Minim 2 caractere", path: ["oras"] });
    }
    if (data.raion.length < 2) {
      ctx.addIssue({ code: "custom", message: "Minim 2 caractere", path: ["raion"] });
    }
    if (!/^(\d{4}|MD-\d{4})$/i.test(data.codPostal)) {
      ctx.addIssue({
        code: "custom",
        message: "Cod poștal MD invalid (ex: MD-2001)",
        path: ["codPostal"],
      });
    }
  });

export type CheckoutFormValues = z.input<typeof checkoutSchema>;
