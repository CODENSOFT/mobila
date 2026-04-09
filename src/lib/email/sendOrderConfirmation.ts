import nodemailer from "nodemailer";

type OrderEmailPayload = {
  orderNumber: string;
  client: {
    prenume: string;
    nume: string;
    email: string;
    telefon: string;
    strada: string;
    numar: string;
    oras: string;
    judet: string;
    codPostal: string;
  };
  produse: Array<{
    nume: string;
    cantitate: number;
    pret: number;
  }>;
  total: number;
  metodaLivrare: "standard" | "express" | "showroom";
};

const deliveryETA: Record<OrderEmailPayload["metodaLivrare"], string> = {
  standard: "3-5 zile lucrătoare",
  express: "1-2 zile lucrătoare",
  showroom: "Ridicare în showroom",
};

export async function sendOrderConfirmation(payload: OrderEmailPayload) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.ORDER_EMAIL_FROM ?? "no-reply@labirint.ro";

  if (!host || !port || !user || !pass) {
    console.warn("SMTP not configured; skipping order confirmation email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const productsHtml = payload.produse
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${item.nume}</td><td style="padding:6px 0">x${item.cantitate}</td><td style="padding:6px 0; text-align:right">${(item.pret * item.cantitate).toLocaleString()} MDL</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2>Comanda ${payload.orderNumber} confirmată ✓</h2>
      <p>Bună ${payload.client.prenume}, mulțumim pentru comandă!</p>
      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        <thead>
          <tr><th align="left">Produs</th><th align="left">Cant.</th><th align="right">Total</th></tr>
        </thead>
        <tbody>${productsHtml}</tbody>
      </table>
      <p style="margin-top:14px;"><strong>Total plătit:</strong> ${payload.total.toLocaleString()} MDL</p>
      <p><strong>Adresă livrare:</strong> ${payload.client.strada} ${payload.client.numar}, ${payload.client.oras}, ${payload.client.judet}, ${payload.client.codPostal}</p>
      <p><strong>Timp estimat:</strong> ${deliveryETA[payload.metodaLivrare]}</p>
      <p style="margin-top:20px;">
        <a href="https://labirint.example/contact" style="background:#1a1a1a;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;">Contactează-ne</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: payload.client.email,
    subject: `Comanda ${payload.orderNumber} confirmată ✓`,
    html,
  });
}
