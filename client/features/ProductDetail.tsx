"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import ActionCard from "./ActionCard";
import Footer from "./Footer";
import Header from "./Header";
import type { Product } from "@/lib/catalog";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { useAuth } from "@/contexts/AuthContext";

type ProductDetailProps = {
  product: Product;
  relatedProducts: Product[];
};

const ProductDetail = ({ product, relatedProducts }: ProductDetailProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const galleryImages =
    product.gallery.length >= 3
      ? product.gallery
      : [product.heroImage, product.heroImage, product.heroImage];

  const activeGalleryImage = galleryImages[activeGalleryIndex] ?? galleryImages[0];

  const handleAddToCart = () => {
    dispatch(addToCart({ productSlug: product.slug, quantity }));
  };

  useEffect(() => {
    const loadWishlistState = async () => {
      if (!isAuthenticated) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch("/api/v1/wishlist", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const items = Array.isArray(result.items) ? result.items : [];
        setIsWishlisted(items.some((item: { productSlug: string }) => item.productSlug === product.slug));
      } catch (error) {
        console.error("Failed to load wishlist state:", error);
      }
    };

    void loadWishlistState();
  }, [isAuthenticated, product.slug]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }

    setWishlistLoading(true);

    try {
      const response = await fetch(
        isWishlisted ? `/api/v1/wishlist/${product.slug}` : "/api/v1/wishlist",
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: isWishlisted ? undefined : JSON.stringify({ productSlug: product.slug }),
        }
      );

      if (!response.ok) {
        toast.error("Unable to update wishlist right now.");
        return;
      }

      setIsWishlisted((current) => !current);
      toast.success(
        isWishlisted
          ? `${product.shortName} removed from wishlist.`
          : `${product.shortName} saved to wishlist.`
      );
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Unable to update wishlist right now.");
    } finally {
      setWishlistLoading(false);
    }
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
            <div className="relative">
              <Image
                src={activeGalleryImage}
                alt={`${product.name} view ${activeGalleryIndex + 1}`}
                className="relative mx-auto max-h-[30rem] w-auto object-contain drop-shadow-[0_36px_38px_rgba(0,0,0,0.18)]"
                width={900}
                height={900}
              />

              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGalleryIndex((current) =>
                        current === 0 ? galleryImages.length - 1 : current - 1
                      )
                    }
                    className="absolute left-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/90 text-[#15161a] transition hover:border-[#d87d4a] hover:bg-[#d87d4a] hover:text-white"
                    aria-label="Previous product image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGalleryIndex((current) =>
                        current === galleryImages.length - 1 ? 0 : current + 1
                      )
                    }
                    className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/90 text-[#15161a] transition hover:border-[#d87d4a] hover:bg-[#d87d4a] hover:text-white"
                    aria-label="Next product image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
              {galleryImages.map((image, index) => (
                <button
                  key={`${product.slug}-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveGalleryIndex(index)}
                  className={`relative overflow-hidden rounded-[1.3rem] border bg-white/65 p-2 transition ${
                    index === activeGalleryIndex
                      ? "border-[#d87d4a] shadow-[0_18px_32px_rgba(216,125,74,0.18)]"
                      : "border-black/8 hover:border-[#d87d4a]/40"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-white">
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
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
                <Button
                  variant="secondary"
                  className={`rounded-full ${
                    isWishlisted
                      ? "border-[#d87d4a] bg-[#d87d4a] text-white hover:bg-[#f0a57b] hover:text-white"
                      : ""
                  }`}
                  disabled={wishlistLoading}
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  {isWishlisted ? "Saved" : "Save"}
                </Button>
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
