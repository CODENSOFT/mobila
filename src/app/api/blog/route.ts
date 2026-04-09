import type { Article } from "../../../types/blog";
import { corsHeaders } from "../../../lib/cors";

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    titlu: "Cum alegi paleta de culori pentru living deschis",
    imagine:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    categorie: "Design Interior",
    data: "2025-11-12",
    excerpt:
      "Tonuri neutre, accente în verde sau lemn natural și lumină bună — ghid scurt pentru un spațiu primitor.",
    slug: "paleta-culori-living",
  },
  {
    id: "2",
    titlu: "Întreținerea fronturilor mate la bucătărie",
    imagine:
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80",
    categorie: "Sfaturi",
    data: "2025-10-28",
    excerpt:
      "Ce produse să eviți, cum cureți fără zgârieturi și cum păstrezi aspectul impecabil ani la rând.",
    slug: "intretinere-fronturi-mate",
  },
  {
    id: "3",
    titlu: "Tendințe 2026: mobilier modular și spații flexibile",
    imagine:
      "https://images.unsplash.com/photo-1616594039964-3f38e9a2dbec?auto=format&fit=crop&w=1200&q=80",
    categorie: "Tendințe",
    data: "2025-09-05",
    excerpt:
      "De la canapele reconfigurabile la depozitare ascunsă — cum se adaptează locuințele la stilul de viață actual.",
    slug: "tendinte-mobilier-modular-2026",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("limit");
  const parsed = raw === null ? 3 : Number.parseInt(raw, 10);
  const limit = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 1), 10)
    : 3;

  const items = MOCK_ARTICLES.slice(0, limit);
  return Response.json(items, { status: 200, headers: corsHeaders });
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}
