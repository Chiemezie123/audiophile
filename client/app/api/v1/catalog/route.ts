import { NextResponse } from "next/server";

import {
  getCatalogProductsBySlugs,
  searchCatalogProducts,
} from "@/lib/server/catalog-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slugs");
  const query = searchParams.get("query");

  if (slugParam) {
    const slugs = slugParam
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const products = await getCatalogProductsBySlugs(slugs);
    return NextResponse.json({ products, status: "success" });
  }

  if (query) {
    const products = await searchCatalogProducts(query);
    return NextResponse.json({ products, status: "success" });
  }

  return NextResponse.json({ products: [], status: "success" });
}
