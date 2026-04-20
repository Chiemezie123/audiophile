import { NextResponse } from "next/server";

import { categories } from "@/lib/catalog";
import { requireAdminUser } from "@/lib/server/admin-auth";
import { getDb } from "@/lib/server/db";

export async function GET(request: Request) {
  const admin = await requireAdminUser(request);

  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const db = await getDb();
  const products = await db.product.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ products, status: "success" });
}

export async function POST(request: Request) {
  const admin = await requireAdminUser(request);

  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const body = await request.json();
  const categorySlug = typeof body?.categorySlug === "string" ? body.categorySlug : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const shortName = typeof body?.shortName === "string" ? body.shortName.trim() : "";
  const price = Number(body?.price);
  const imageUrls = Array.isArray(body?.imageUrls)
    ? body.imageUrls.filter(
        (value: unknown): value is string =>
          typeof value === "string" && value.trim().length > 0
      )
    : [];

  if (!categories.includes(categorySlug as (typeof categories)[number])) {
    return NextResponse.json({ message: "Valid category is required." }, { status: 400 });
  }

  if (!slug || !name || !shortName || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { message: "Slug, name, short name, and a valid price are required." },
      { status: 400 }
    );
  }

  if (imageUrls.length < 3 || imageUrls.length > 5) {
    return NextResponse.json(
      { message: "Products must include between 3 and 5 image URLs." },
      { status: 400 }
    );
  }

  const db = await getDb();

  try {
    const product = await db.product.create({
      data: {
        slug,
        categorySlug,
        name,
        shortName,
        price: Math.round(price),
        tagline: typeof body?.tagline === "string" ? body.tagline.trim() : "",
        description:
          typeof body?.description === "string" ? body.description.trim() : "",
        isNew: Boolean(body?.isNew),
        imageUrls,
        features: Array.isArray(body?.features)
          ? body.features.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
          : [],
        includes: Array.isArray(body?.includes)
          ? body.includes.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
          : [],
        relatedSlugs: Array.isArray(body?.relatedSlugs)
          ? body.relatedSlugs.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
          : [],
        accent:
          typeof body?.accent === "string" && body.accent.trim().length > 0
            ? body.accent.trim()
            : "oklch(0.7 0.08 40)",
      },
    });

    return NextResponse.json({ product, status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Failed to create admin product:", error);
    return NextResponse.json(
      { message: "Unable to create product. Check the slug is unique." },
      { status: 400 }
    );
  }
}
