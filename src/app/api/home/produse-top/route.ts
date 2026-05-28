export const dynamic = "force-dynamic";
export const revalidate = 0;

import { corsHeaders } from "@/src/lib/cors";
import { getTopProducts } from "@/src/services/products";

export async function GET() {
  try {
    const products = await getTopProducts();
    return Response.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error("[api/home/produse-top]", error);
    return Response.json([], { headers: corsHeaders });
  }
}
