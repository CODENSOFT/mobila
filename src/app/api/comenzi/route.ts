import mongoose, { isValidObjectId, Types } from "mongoose";

import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import { sendOrderConfirmation } from "@/src/lib/email/sendOrderConfirmation";
import Order from "@/src/models/Order";
import Product from "@/src/models/Product";

type CreateOrderBody = {
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
    id: string;
    nume: string;
    imagine: string;
    pret: number;
    cantitate: number;
    slug: string;
  }>;
  subtotal: number;
  transport: number;
  reducere: number;
  total: number;
  codReducere?: string;
  metodaPlata: "card" | "ramburs" | "transfer";
  metodaLivrare: "standard" | "express" | "showroom";
  nota?: string;
};

function orderNumberFromCount(count: number) {
  const year = new Date().getFullYear();
  return `#ORD-${year}-${String(count + 1).padStart(4, "0")}`;
}

type LooseOrderBody = Partial<CreateOrderBody> & {
  nume?: string;
  telefon?: string;
  adresa?: string;
  email?: string;
  oras?: string;
  judet?: string;
  codPostal?: string;
};

type ChatBotOrderBody = {
  nume_client?: string;
  telefon?: string;
  tip_mobila?: string;
  dimensiuni?: string;
  material?: string;
  culoare?: string;
  canal?: "telegram" | "website";
  sursa?: string;
  status?: string;
  data_creare?: string | Date;
};

function trimStr(v: unknown): string {
  return v == null ? "" : String(v).trim();
}

const MD_PHONE_RE = /^(\+373|0)[0-9]{8}$/;
const MD_POSTAL_RE = /^(\d{4}|MD-\d{4})$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validare client pentru payload-ul din checkout (obiect `client` nested). */
function validateStructuredClient(c: {
  prenume: string;
  nume: string;
  email: string;
  telefon: string;
  strada: string;
  numar: string;
  oras: string;
  judet: string;
  codPostal: string;
}): string | null {
  const missing: string[] = [];

  if (c.prenume.length < 2) {
    missing.push("prenumele (minim 2 caractere)");
  }
  if (c.nume.length < 2) {
    missing.push("numele (minim 2 caractere)");
  }
  if (!EMAIL_RE.test(c.email)) {
    missing.push("o adresă de email validă");
  }
  if (!MD_PHONE_RE.test(c.telefon)) {
    missing.push("telefonul în format moldovenesc (ex: 079123456 sau +37379123456)");
  }

  const addrParts = [c.strada, c.numar, c.oras, c.judet, c.codPostal];
  const anyAddr = addrParts.some((p) => p.length > 0);
  const allAddr = addrParts.every((p) => p.length > 0);

  if (anyAddr && !allAddr) {
    return "Adresa: completează strada, numărul, orașul, raionul și codul poștal, sau lasă toate câmpurile de adresă goale.";
  }

  if (allAddr) {
    if (c.strada.length < 3) {
      missing.push("strada (minim 3 caractere)");
    }
    if (!c.numar.length) {
      missing.push("numărul străzii");
    }
    if (c.oras.length < 2) {
      missing.push("orașul");
    }
    if (c.judet.length < 2) {
      missing.push("raionul / municipiul");
    }
    if (!MD_POSTAL_RE.test(c.codPostal)) {
      missing.push("codul poștal (ex: MD-2001)");
    }
  }

  if (missing.length) {
    return `Date incomplete sau invalide. Verifică: ${missing.join(", ")}.`;
  }
  return null;
}

type NormalizeOrderResult =
  | { ok: true; body: CreateOrderBody }
  | { ok: false; message: string };

function normalizeOrderBody(body: LooseOrderBody): NormalizeOrderResult {
  if (!Array.isArray(body.produse) || body.produse.length === 0) {
    return { ok: false, message: "Comanda nu conține produse (coșul este gol sau datele lipsesc)." };
  }

  const hasClientObject = !!body.client && typeof body.client === "object";

  let client: CreateOrderBody["client"];

  if (hasClientObject) {
    const raw = body.client as Record<string, unknown>;
    client = {
      prenume: trimStr(raw.prenume),
      nume: trimStr(raw.nume),
      email: trimStr(raw.email),
      telefon: trimStr(raw.telefon).replace(/\s/g, ""),
      strada: trimStr(raw.strada),
      numar: trimStr(raw.numar),
      oras: trimStr(raw.oras),
      judet: trimStr(raw.judet),
      codPostal: trimStr(raw.codPostal),
    };
    const clientErr = validateStructuredClient(client);
    if (clientErr) {
      return { ok: false, message: clientErr };
    }
  } else {
    const nume = trimStr(body.nume);
    const telefon = trimStr(body.telefon);
    if (!nume || !telefon) {
      return {
        ok: false,
        message: "Pentru această comandă sunt obligatorii numele și numărul de telefon.",
      };
    }
    client = {
      prenume: "",
      nume,
      email: trimStr(body.email) || "no-reply@labirint.local",
      telefon,
      strada: trimStr(body.adresa),
      numar: "-",
      oras: trimStr(body.oras) || "Chișinău",
      judet: trimStr(body.judet) || "Chișinău",
      codPostal: trimStr(body.codPostal) || "MD-2001",
    };
  }

  const totalRaw = body.total;
  const total =
    typeof totalRaw === "number" && Number.isFinite(totalRaw)
      ? totalRaw
      : Number(totalRaw);
  if (!Number.isFinite(total) || total <= 0) {
    return {
      ok: false,
      message: "Totalul comenzii lipsește sau nu este valid (trebuie să fie mai mare ca 0).",
    };
  }

  const subRaw = body.subtotal;
  const subtotal =
    typeof subRaw === "number" && Number.isFinite(subRaw)
      ? subRaw
      : Number.isFinite(Number(subRaw))
        ? Number(subRaw)
        : total;
  const transportRaw = body.transport;
  const transport =
    typeof transportRaw === "number" && Number.isFinite(transportRaw)
      ? transportRaw
      : Number.isFinite(Number(transportRaw))
        ? Number(transportRaw)
        : 0;
  const reducereRaw = body.reducere;
  const reducere =
    typeof reducereRaw === "number" && Number.isFinite(reducereRaw)
      ? reducereRaw
      : Number.isFinite(Number(reducereRaw))
        ? Number(reducereRaw)
        : 0;

  const metodaPlata = body.metodaPlata ?? "ramburs";
  if (!["card", "ramburs", "transfer"].includes(metodaPlata)) {
    return { ok: false, message: "Metoda de plată selectată nu este validă." };
  }
  const metodaLivrare = body.metodaLivrare ?? "standard";
  if (!["standard", "express", "showroom"].includes(metodaLivrare)) {
    return { ok: false, message: "Metoda de livrare selectată nu este validă." };
  }

  const normalizedProducts = body.produse
    .filter((p) => {
      if (typeof p !== "object" || p === null) return false;
      const pretNum =
        typeof p.pret === "number" && Number.isFinite(p.pret) ? p.pret : Number(p.pret);
      const qtyNum =
        typeof p.cantitate === "number" && Number.isFinite(p.cantitate)
          ? p.cantitate
          : Number(p.cantitate);
      return Number.isFinite(pretNum) && pretNum >= 0 && Number.isFinite(qtyNum) && qtyNum > 0;
    })
    .map((p) => {
      const pretNum =
        typeof p.pret === "number" && Number.isFinite(p.pret) ? p.pret : Number(p.pret);
      const qtyNum =
        typeof p.cantitate === "number" && Number.isFinite(p.cantitate)
          ? p.cantitate
          : Number(p.cantitate);
      return {
        id: p.id ?? "",
        nume: p.nume ?? "Produs",
        imagine: p.imagine ?? "/images/categories/dormitor.png",
        pret: Math.max(0, Math.round(pretNum)),
        cantitate: Math.trunc(qtyNum),
        slug: p.slug ?? "",
      };
    });

  if (normalizedProducts.length === 0) {
    return {
      ok: false,
      message:
        "Niciun produs valid în comandă. Verifică că fiecare articol are preț și cantitate numerice (cantitatea minim 1).",
    };
  }

  return {
    ok: true,
    body: {
      client,
      produse: normalizedProducts,
      subtotal,
      transport,
      reducere,
      total,
      codReducere: body.codReducere ?? "",
      metodaPlata: metodaPlata as CreateOrderBody["metodaPlata"],
      metodaLivrare: metodaLivrare as CreateOrderBody["metodaLivrare"],
      nota: typeof body.nota === "string" ? body.nota : "",
    },
  };
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack ?? "",
    };
  }
  return {
    message: String(error),
    stack: "",
  };
}

type SortBy = "newest" | "oldest" | "valueAsc" | "valueDesc";

function normalizeSort(sortBy: string | null): SortBy {
  if (sortBy === "oldest") return "oldest";
  if (sortBy === "valueAsc") return "valueAsc";
  if (sortBy === "valueDesc") return "valueDesc";
  return "newest";
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.trunc(parsed));
}

function parseDateParam(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // /api/comenzi -> return paginated orders list
    if (!id) {
      const page = parsePositiveInt(searchParams.get("page"), 1);
      const limit = Math.min(100, parsePositiveInt(searchParams.get("limit"), 20));
      const status = searchParams.get("status");
      const search = (searchParams.get("search") ?? "").trim();
      const startDate = parseDateParam(searchParams.get("startDate"));
      const endDate = parseDateParam(searchParams.get("endDate"));
      const sortBy = normalizeSort(searchParams.get("sortBy"));

      const query: Record<string, unknown> = {};

      if (
        status &&
        ["noua", "procesata", "expediata", "livrata", "anulata"].includes(status)
      ) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: "i" } },
          { "client.nume": { $regex: search, $options: "i" } },
          { "client.email": { $regex: search, $options: "i" } },
        ];
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          (query.createdAt as Record<string, unknown>).$gte = startDate;
        }
        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
          (query.createdAt as Record<string, unknown>).$lte = endDate;
        }
      }

      const sort =
        sortBy === "oldest"
          ? "createdAt"
          : sortBy === "valueAsc"
            ? "total"
            : sortBy === "valueDesc"
              ? "-total"
              : "-createdAt";

      const total = await Order.countDocuments(query);
      const pagini = Math.max(1, Math.ceil(total / limit));
      const safePage = Math.min(page, pagini);
      const comenzi = await Order.find(query)
        .sort(sort)
        .skip((safePage - 1) * limit)
        .limit(limit)
        .lean();

      return Response.json(
        { comenzi, total, pagini, page: safePage },
        { headers: buildCorsHeaders(request) }
      );
    }

    // /api/comenzi?id=... -> return single order with ObjectId validation
    if (!isValidObjectId(id)) {
      return Response.json(
        { message: "ID comandă invalid." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    const comanda = await Order.findById(id).lean();
    if (!comanda) {
      return Response.json(
        { message: "Comanda nu a fost găsită." },
        { status: 404, headers: buildCorsHeaders(request) }
      );
    }
    return Response.json(comanda, { headers: buildCorsHeaders(request) });
  } catch (error) {
    console.error("GET /api/comenzi error", error);
    return Response.json(
      { message: "Eroare server." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return Response.json(
        { message: "Content-Type invalid. Folosește application/json." },
        { status: 415, headers: buildCorsHeaders(request) }
      );
    }
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return Response.json(
        { message: "Body JSON invalid." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    if (
      rawBody !== null &&
      typeof rawBody === "object" &&
      "raw_text" in rawBody &&
      typeof (rawBody as { raw_text?: unknown }).raw_text === "string"
    ) {
      try {
        const rt = (rawBody as { raw_text: string }).raw_text;
        const extracted = rt.split("##COMANDA##")[1]?.split("##SFARSIT##")[0];
        const normalized = extracted?.replace(/'/g, '"');
        rawBody = JSON.parse(normalized ?? "");
      } catch {
        return Response.json(
          { message: "Raw text parse error" },
          { status: 400, headers: buildCorsHeaders(request) }
        );
      }
    }

    console.log("[orders] req.body:", rawBody);

    const chatBody = rawBody as ChatBotOrderBody;
    const isChatBotPayload =
      !!chatBody &&
      typeof chatBody === "object" &&
      typeof chatBody.nume_client === "string" &&
      typeof chatBody.telefon === "string" &&
      typeof chatBody.tip_mobila === "string" &&
      typeof chatBody.dimensiuni === "string" &&
      typeof chatBody.material === "string" &&
      typeof chatBody.culoare === "string" &&
      true;

    if (isChatBotPayload) {
      const count = await Order.countDocuments();
      const orderNumber = orderNumberFromCount(count);
      const parsedDate =
        chatBody.data_creare instanceof Date
          ? chatBody.data_creare
          : new Date(chatBody.data_creare ?? new Date());
      const dataCreare = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      const created = await Order.create({
        orderNumber,
        client: {
          nume: chatBody.nume_client,
          email: "no-reply@labirint.local",
          telefon: chatBody.telefon,
          adresa: "-",
          oras: "Soroca",
          judet: "Soroca",
          codPostal: "MD-3000",
        },
        produse: [],
        subtotal: 0,
        transport: 0,
        reducere: 0,
        total: 0,
        codReducere: "",
        metodaPlata: "ramburs",
        metodaLivrare: "standard",
        notaInterna: "",
        nume_client: chatBody.nume_client,
        telefon: chatBody.telefon,
        tip_mobila: chatBody.tip_mobila,
        dimensiuni: chatBody.dimensiuni,
        material: chatBody.material,
        culoare: chatBody.culoare,
        canal: (chatBody.canal === "telegram" || chatBody.canal === "website") ? chatBody.canal : "website",
        sursa: "chat-bot",
        status: "noua",
        data_creare: dataCreare,
        statusHistory: [{ status: "noua", changedAt: new Date(), changedBy: "Chat Bot" }],
        updatedAt: new Date(),
      });

      return Response.json(
        { success: true, id: String(created._id) },
        { status: 201, headers: buildCorsHeaders(request) }
      );
    }

    const normalized = normalizeOrderBody(rawBody as LooseOrderBody);
    if (normalized.ok === false) {
      return Response.json(
        { message: normalized.message },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }
    const body = normalized.body;

    const productIds = body.produse
      .map((p) => p.id)
      .filter((id) => isValidObjectId(id))
      .map((id) => new Types.ObjectId(id));

    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    const byId = new Map(dbProducts.map((p) => [String(p._id), p]));

    for (const item of body.produse) {
      if (!isValidObjectId(item.id)) continue;
      const db = byId.get(item.id);
      if (!db) {
        return Response.json(
          { message: `Produs indisponibil: ${item.nume}` },
          { status: 409, headers: buildCorsHeaders(request) }
        );
      }
      const stock = Number((db as { stoc?: unknown }).stoc);
      if (Number.isFinite(stock) && stock < item.cantitate) {
        return Response.json(
          {
            message: `Stoc insuficient pentru ${item.nume}. Disponibil: ${stock}.`,
            productId: item.id,
          },
          { status: 409, headers: buildCorsHeaders(request) }
        );
      }
    }

    if (body.metodaPlata === "card") {
      const timeout = Math.random() < 0.03;
      if (timeout) {
        return Response.json(
          { message: "Timeout la procesarea plății cu cardul. Te rugăm să reîncerci." },
          { status: 408, headers: buildCorsHeaders(request) }
        );
      }
    }

    const count = await Order.countDocuments();
    const orderNumber = orderNumberFromCount(count);

    const created = await Order.create({
      orderNumber,
      client: {
        nume: `${body.client.prenume} ${body.client.nume}`.trim(),
        email: body.client.email,
        telefon: body.client.telefon,
        adresa: `${body.client.strada} ${body.client.numar}`.trim(),
        oras: body.client.oras,
        judet: body.client.judet,
        codPostal: body.client.codPostal,
      },
      produse: body.produse.map((item) => ({
        produsId: isValidObjectId(item.id) ? new Types.ObjectId(item.id) : undefined,
        nume: item.nume,
        imagine: item.imagine,
        pret: item.pret,
        cantitate: item.cantitate,
      })),
      subtotal: body.subtotal,
      transport: body.transport,
      reducere: body.reducere,
      total: body.total,
      codReducere: body.codReducere ?? "",
      metodaPlata: body.metodaPlata,
      metodaLivrare: body.metodaLivrare,
      notaInterna: body.nota ?? "",
      status: "noua",
      statusHistory: [{ status: "noua", changedAt: new Date(), changedBy: "Sistem" }],
      updatedAt: new Date(),
    });

    try {
      await sendOrderConfirmation({
        orderNumber: created.orderNumber,
        client: body.client,
        produse: body.produse.map((item) => ({
          nume: item.nume,
          cantitate: item.cantitate,
          pret: item.pret,
        })),
        total: body.total,
        metodaLivrare: body.metodaLivrare,
      });
    } catch (mailError) {
      const mailDetails = getErrorDetails(mailError);
      // Email must not block successful order placement in production.
      console.error("Order created, but email sending failed:", mailDetails.message);
      if (mailDetails.stack) {
        console.error(mailDetails.stack);
      }
    }

    return Response.json(
      { ok: true, id: String(created._id), orderNumber: created.orderNumber },
      { status: 201, headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const issues = Object.values(error.errors).map((e) => e.message);
      return Response.json(
        {
          message:
            issues.length > 0
              ? issues.join(" ")
              : "Unele date nu sunt valide. Verifică formularul și încearcă din nou.",
          issues,
        },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    const details = getErrorDetails(error);
    console.error("POST /api/comenzi error:", details.message);
    if (details.stack) {
      console.error(details.stack);
    }
    return Response.json(
      {
        message: "Eroare server. Te rugăm să încerci din nou sau să ne contactezi.",
        error: details.message,
      },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}
