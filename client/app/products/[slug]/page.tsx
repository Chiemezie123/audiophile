import { notFound } from "next/navigation";

import ProductDetail from "@/features/ProductDetail";
import {
  getCatalogProductBySlug,
  getRelatedCatalogProducts,
} from "@/lib/server/catalog-store";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedCatalogProducts(product);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
