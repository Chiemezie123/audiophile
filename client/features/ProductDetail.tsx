"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import ActionCard from "./ActionCard";
import Footer from "./Footer";
import Header from "./Header";
import type { Product } from "@/lib/catalog";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";

type ProductDetailProps = {
  product: Product;
  relatedProducts: Product[];
};

const ProductDetail = ({ product, relatedProducts }: ProductDetailProps) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ productSlug: product.slug, quantity }));
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
      <Header />

      <main className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href={`/categories/${product.category}`}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/48 transition hover:text-[#d87d4a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {product.category}
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/6 bg-[#efe8de] p-8 sm:p-12">
            <div
              className="absolute inset-x-16 top-10 h-24 rounded-full opacity-80 blur-3xl"
              style={{ backgroundColor: product.accent }}
            />
            <Image
              src={product.heroImage}
              alt={product.name}
              className="relative mx-auto max-h-[30rem] w-auto object-contain drop-shadow-[0_36px_38px_rgba(0,0,0,0.18)]"
            />
          </div>

          <div className="rounded-[2.5rem] border border-black/6 bg-white p-8 shadow-[0_24px_60px_rgba(16,18,25,0.08)] sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                {product.category}
              </span>
              {product.isNew ? (
                <span className="rounded-full bg-[#d87d4a]/12 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[#d87d4a]">
                  New arrival
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-3xl font-black uppercase tracking-[0.08em] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base font-medium text-black/65">
              {product.tagline}
            </p>
            <p className="mt-6 text-sm leading-7 text-black/62 sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-black/38">
                  Price
                </p>
                <p className="mt-1 text-3xl font-black text-[#15161a]">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SizeInputHandler
                  value={quantity}
                  onChange={setQuantity}
                  className="rounded-full bg-[#f3efe8]"
                />
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_18px_48px_rgba(16,18,25,0.06)] sm:p-10">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#d87d4a]" />
              <h2 className="text-2xl font-black uppercase tracking-[0.08em]">
                Features
              </h2>
            </div>
            <div className="mt-6 space-y-5 text-sm leading-7 text-black/62 sm:text-base">
              {product.features.map((feature) => (
                <p key={feature}>{feature}</p>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-black/6 bg-[#111215] p-8 text-white shadow-[0_24px_60px_rgba(16,18,25,0.12)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d9a07d]">
              In the box
            </p>
            <ul className="mt-6 space-y-4">
              {product.includes.map((item) => (
                <li key={item.item} className="flex items-start justify-between gap-4">
                  <span className="text-lg font-black text-[#f4c2a3]">
                    {item.quantity}x
                  </span>
                  <span className="flex-1 text-sm uppercase tracking-[0.1em] text-white/78">
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            {product.gallery.slice(0, 2).map((image, index) => (
              <div
                key={index}
                className="relative min-h-[14rem] overflow-hidden rounded-[2rem] bg-[#ece4d8]"
              >
                <Image
                  src={image}
                  alt={`${product.name} gallery ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            ))}
          </div>
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-[#ece4d8]">
            <Image
              src={product.gallery[2]}
              alt={`${product.name} gallery`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                Keep browsing
              </p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">
                You may also like
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </main>

      <ActionCard />
      <Footer />
    </div>
  );
};

export default ProductDetail;
