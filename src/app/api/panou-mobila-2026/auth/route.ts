import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const adminPreview = (process.env.ADMIN_PASSWORD ?? "").slice(0, 3);
    console.log("[panou auth] ADMIN_PASSWORD (first 3 chars):", adminPreview);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const password =
      typeof body === "object" &&
      body !== null &&
      "password" in body &&
      typeof (body as { password?: unknown }).password === "string"
        ? (body as { password: string }).password
        : "";

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword == null || adminPassword === "") {
      return NextResponse.json(
        { ok: false, message: "ADMIN_PASSWORD nu este setat." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_auth", password, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("[panou auth] POST error:", error);
    return NextResponse.json(
      { ok: false, message: "A aparut o eroare." },
      { status: 500 }
    );
  }
}
