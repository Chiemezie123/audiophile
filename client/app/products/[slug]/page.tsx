import { notFound } from "next/navigation";

import ProductDetail from "@/features/ProductDetail";
import { allProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} relatedProducts={getRelatedProducts(product)} />;
}
