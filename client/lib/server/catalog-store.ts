import type { Product as PrismaProduct } from "@prisma/client";

import {
  categories,
  categoryMeta,
  getProductBySlug as getStaticProductBySlug,
  homeCategoryCards,
  productsByCategory,
  type CategorySlug,
  type Product,
} from "@/lib/catalog";

import { getDb } from "./db";

type CatalogProductRecord = Pick<
  PrismaProduct,
  | "slug"
  | "categorySlug"
  | "name"
  | "shortName"
  | "price"
  | "tagline"
  | "description"
  | "isNew"
  | "imageUrls"
  | "features"
  | "includes"
  | "relatedSlugs"
  | "accent"
>;

function parseIncludeEntry(entry: string) {
  const match = entry.trim().match(/^(\d+)\s*x\s+(.+)$/i);

  if (match) {
    return {
      quantity: Number(match[1]),
      item: match[2].trim(),
    };
  }

  return {
    quantity: 1,
    item: entry.trim(),
  };
}

function getCategoryVisualDefaults(category: CategorySlug) {
  const staticProducts = productsByCategory[category];
  const fallback = staticProducts[0];

  return {
    heroImage: fallback.heroImage,
    cardImage: fallback.cardImage,
    gallery: fallback.gallery,
    accent: fallback.accent,
  };
}

function getProductImages(record: CatalogProductRecord, category: CategorySlug) {
  const staticProduct = getStaticProductBySlug(record.slug);
  const fallbackVisuals = staticProduct ?? getCategoryVisualDefaults(category);

  if (record.imageUrls.length >= 3) {
    return {
      heroImage: record.imageUrls[0],
      cardImage: record.imageUrls[0],
      gallery: record.imageUrls,
      accent: record.accent || fallbackVisuals.accent,
    };
  }

  return {
    heroImage: fallbackVisuals.heroImage,
    cardImage: fallbackVisuals.cardImage,
    gallery: fallbackVisuals.gallery,
    accent: record.accent || fallbackVisuals.accent,
  };
}

function mapRecordToProduct(record: CatalogProductRecord): Product {
  const category = record.categorySlug as CategorySlug;
  const staticProduct = getStaticProductBySlug(record.slug);
  const visuals = getProductImages(record, category);

  return {
    id: record.slug,
    slug: record.slug,
    category,
    name: record.name,
    shortName: record.shortName,
    tagline: record.tagline || staticProduct?.tagline || `${categoryMeta[category].name} built for premium listening`,
    price: record.price,
    isNew: record.isNew,
    description:
      record.description ||
      staticProduct?.description ||
      `A premium ${category.slice(0, -1)} option added through the FuzzyBeats catalog CMS.`,
    heroImage: visuals.heroImage,
    cardImage: visuals.cardImage,
    gallery: visuals.gallery,
    features:
      record.features.length > 0
        ? record.features
        : staticProduct?.features || [
            "Crafted to fit directly into the FuzzyBeats storefront.",
            "Managed through the admin dashboard so catalog updates stay simple.",
          ],
    includes:
      record.includes.length > 0
        ? record.includes.map(parseIncludeEntry)
        : staticProduct?.includes || [{ quantity: 1, item: record.name }],
    relatedSlugs:
      record.relatedSlugs.length > 0
        ? record.relatedSlugs
        : staticProduct?.relatedSlugs || [],
    accent: visuals.accent,
  };
}

export async function getCatalogProducts() {
  const db = await getDb();
  const rows = await db.product.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map(mapRecordToProduct);
}

export async function getCatalogProductsByCategory(category: CategorySlug) {
  const db = await getDb();
  const rows = await db.product.findMany({
    where: { categorySlug: category },
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map(mapRecordToProduct);
}

export async function getCatalogProductBySlug(slug: string) {
  const db = await getDb();
  const row = await db.product.findUnique({
    where: { slug },
  });

  return row ? mapRecordToProduct(row) : null;
}

export async function getCatalogProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return [];
  }

  const db = await getDb();
  const rows = await db.product.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });

  return rows.map(mapRecordToProduct);
}

export async function searchCatalogProducts(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const db = await getDb();
  const rows = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: normalizedQuery, mode: "insensitive" } },
        { shortName: { contains: normalizedQuery, mode: "insensitive" } },
        { categorySlug: { contains: normalizedQuery, mode: "insensitive" } },
        { tagline: { contains: normalizedQuery, mode: "insensitive" } },
        { description: { contains: normalizedQuery, mode: "insensitive" } },
      ],
    },
    take: 6,
    orderBy: [{ createdAt: "desc" }],
  });

  return rows.map(mapRecordToProduct);
}

export async function getRelatedCatalogProducts(product: Product) {
  if (product.relatedSlugs.length > 0) {
    const related = await getCatalogProductsBySlugs(product.relatedSlugs);
    if (related.length > 0) {
      return related.filter((item) => item.slug !== product.slug).slice(0, 3);
    }
  }

  const sameCategory = await getCatalogProductsByCategory(product.category);
  return sameCategory.filter((item) => item.slug !== product.slug).slice(0, 3);
}

export function getCategoryOptions() {
  return categories.map((category) => ({
    slug: category,
    name: categoryMeta[category].name,
    image: homeCategoryCards.find((card) => card.category === category)?.image,
  }));
}
