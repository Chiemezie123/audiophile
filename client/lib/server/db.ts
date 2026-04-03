import { prisma } from "./prisma";
import { categorySeed, productSeed } from "./product-seed";

let seeded = false;

export async function getDb() {
  if (!seeded) {
    await seedReferenceData();
    seeded = true;
  }

  return prisma;
}

async function seedReferenceData() {
  for (const category of categorySeed) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
      },
      create: {
        slug: category.slug,
        name: category.name,
      },
    });
  }

  for (const product of productSeed) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categorySlug: product.categorySlug,
        name: product.name,
        shortName: product.shortName,
        price: product.price,
      },
      create: {
        slug: product.slug,
        categorySlug: product.categorySlug,
        name: product.name,
        shortName: product.shortName,
        price: product.price,
      },
    });
  }
}

export function nowIso() {
  return new Date().toISOString();
}
