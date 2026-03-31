import { notFound } from "next/navigation";

import Category from "@/features/category";
import { categories, type CategorySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!categories.includes(category as CategorySlug)) {
    notFound();
  }

  return <Category category={category as CategorySlug} />;
}
