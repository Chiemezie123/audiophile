"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Footer from "@/features/Footer";
import Header from "@/features/Header";
import { getProductImageSrc, type Product } from "@/lib/catalog";
import { fetchCatalogProductsBySlugs } from "@/lib/catalog-api";
import { useAuth } from "@/contexts/AuthContext";

type WishlistItem = {
  productSlug: string;
  createdAt: string;
};

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signup");
      return;
    }

    const loadWishlist = async () => {
      try {
        const response = await fetch("/api/v1/wishlist", {
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json();
        setItems(Array.isArray(result.items) ? result.items : []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadWishlist();
  }, [isAuthenticated, router]);

  const products = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          product: catalogProducts[item.productSlug],
        }))
        .filter(
          (
            entry
          ): entry is WishlistItem & {
            product: Product;
          } => Boolean(entry.product)
        ),
    [catalogProducts, items]
  );

  useEffect(() => {
    const loadCatalogProducts = async () => {
      const products = await fetchCatalogProductsBySlugs(
        items.map((item) => item.productSlug)
      );

      setCatalogProducts(
        products.reduce<Record<string, Product>>((accumulator, product) => {
          accumulator[product.slug] = product;
          return accumulator;
        }, {})
      );
    };

    void loadCatalogProducts();
  }, [items]);

  const handleRemove = async (productSlug: string) => {
    try {
      const response = await fetch(`/api/v1/wishlist/${productSlug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();
      setItems(Array.isArray(result.items) ? result.items : []);
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white">
      <Header />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(216,125,74,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f1c2a4]">
                  Wishlist
                </p>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Save the gear you love and come back when you are ready.
                </h1>
                <p className="mt-4 text-sm leading-7 text-white/64 sm:text-base">
                  Your saved products are now stored with your account, not only
                  in the browser.
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/6">
                <Heart className="h-7 w-7 text-[#d87d4a]" />
              </div>
            </div>
          </section>

          {loading ? (
            <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/5 p-6 text-sm text-white/60">
              Loading your wishlist...
            </div>
          ) : products.length === 0 ? (
            <div className="mt-8 rounded-[1.7rem] border border-dashed border-white/12 bg-[#14161b] p-6">
              <p className="text-sm leading-7 text-white/60">
                Your wishlist is currently empty.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/categories/earphones"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b]"
                >
                  Discover Earphones
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/categories/headphones"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:border-white/20 hover:bg-white hover:text-[#131418]"
                >
                  Shop Headphones
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {products.map(({ product }) => (
                <div
                  key={product.slug}
                  className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.2rem] bg-[#efe8de] p-3">
                      <img
                        src={getProductImageSrc(product.cardImage)}
                        alt={product.name}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/42">
                        {product.category}
                      </p>
                      <p className="mt-1 truncate text-lg font-black uppercase tracking-[0.08em] text-white">
                        {product.shortName}
                      </p>
                      <p className="mt-2 text-sm text-[#f1c2a4]">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#f0a57b]"
                    >
                      View Product
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/20 hover:bg-white hover:text-[#131418]"
                      onClick={() => handleRemove(product.slug)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
