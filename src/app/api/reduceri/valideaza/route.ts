import { corsHeaders } from "../../../../lib/cors";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { cod?: string } | null;
  const cod = body?.cod?.trim().toUpperCase() ?? "";

  const codes: Record<string, number> = {
    SAVE10: 10,
    LAB15: 15,
  };

  if (!cod || !(cod in codes)) {
    return Response.json(
      { valid: false, message: "Cod invalid sau expirat." },
      { status: 400, headers: corsHeaders }
    );
  }

  return Response.json(
    { valid: true, cod, procent: codes[cod] },
    { status: 200, headers: corsHeaders }
  );
}
