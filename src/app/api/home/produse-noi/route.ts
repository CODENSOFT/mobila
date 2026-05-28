export const dynamic = "force-dynamic";
export const revalidate = 0;

import { corsHeaders } from "@/src/lib/cors";
import { getFeaturedProducts } from "@/src/services/products";

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return Response.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error("[api/home/produse-noi]", error);
    return Response.json([], { headers: corsHeaders });
  }
}
