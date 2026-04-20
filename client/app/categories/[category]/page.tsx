import { notFound } from "next/navigation";

import Category from "@/features/category";
import { categories, type CategorySlug } from "@/lib/catalog";
import { getCatalogProductsByCategory } from "@/lib/server/catalog-store";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};




export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!categories.includes(category as CategorySlug)) {
    notFound();
  }

  const products = await getCatalogProductsByCategory(category as CategorySlug);

  return <Category category={category as CategorySlug} products={products} />;
}
