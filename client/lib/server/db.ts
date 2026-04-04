import { getPrismaClient } from "./prisma";
import { categorySeed, productSeed } from "./product-seed";

let seeded = false;

export async function getDb() {
  const prisma = getPrismaClient();

  if (!seeded) {
    await seedReferenceData(prisma);
    seeded = true;
  }

  return prisma;
}

async function seedReferenceData(prisma: ReturnType<typeof getPrismaClient>) {
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
