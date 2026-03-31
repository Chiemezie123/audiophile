import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import ActionCard from "@/features/ActionCard";
import Footer from "@/features/Footer";
import Header from "@/features/Header";
import CategoryCard from "@/components/ui/CategoryCard";
import ProductCard from "@/components/ui/ProductCard";
import {
  allProducts,
  featuredProducts,
  homeCategoryCards,
} from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const curatedProducts = allProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
      <Header />

      <main>
        <section className="border-b border-white/8 bg-[#111215] text-white">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9a07d]">
                Premium audio commerce
              </p>
              <h1 className="mt-6 text-4xl font-black uppercase tracking-[0.08em] sm:text-5xl lg:text-6xl">
                Discover headphones, speakers, and earphones that feel worth the upgrade.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                A cleaner product journey for a modern audio store, with strong category browsing,
                fast search, and product detail pages built to convert curiosity into confidence.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/products/${featuredProducts.hero.slug}`}>
                  <Button>Shop flagship</Button>
                </Link>
                <Link
                  href="/categories/headphones"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-white/82 transition hover:bg-white/10"
                >
                  Browse catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Products", value: "6+" },
                  { label: "Categories", value: "3" },
                  { label: "Search-ready", value: "Full DB" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative  overflow-hidden rounded-[2.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 sm:p-10">
              <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-[#d87d4a]/20 blur-3xl" />
              <div className="absolute -left-10 bottom-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="rounded-[1.8rem] border border-white/10 bg-[#17191d] p-5">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Search className="h-4 w-4 text-[#d87d4a]" />
                    Search all products
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-[1.2rem] bg-white px-4 py-3 text-black">
                    <span className="text-sm text-black/45">
                      “{featuredProducts.portable.shortName.toLowerCase()}”
                    </span>
                    <span className="rounded-full bg-[#111215] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white">
                      live results
                    </span>
                  </div>
                  <div className="mt-4 space-y-3 ">
                    {[featuredProducts.portable, featuredProducts.hero].map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-4 rounded-[1.2rem] bg-white/5 px-4 py-3 transition hover:bg-white/8"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[#f4efe8] p-2">
                          <Image
                            src={product.cardImage}
                            alt={product.name}
                            className="max-h-full w-auto object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                            {product.category}
                          </p>
                          <p className="mt-1 text-sm font-bold uppercase tracking-[0.08em] text-white">
                            {product.shortName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative flex min-h-[18rem] items-end justify-center rounded-[2rem] bg-[#efe8de] p-8">
                  <Image
                    src={featuredProducts.hero.heroImage}
                    alt={featuredProducts.hero.name}
                    className="max-h-[20rem] w-auto object-contain drop-shadow-[0_30px_32px_rgba(0,0,0,0.2)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {homeCategoryCards.map((card) => (
              <CategoryCard
                key={card.category}
                image={card.image}
                label={card.label}
                href={`/categories/${card.category}`}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-[2.6rem] bg-[#d87d4a] p-8 text-white shadow-[0_28px_80px_rgba(216,125,74,0.22)] sm:p-10 lg:p-14">
              <div className="absolute -left-20 -top-16 h-64 w-64 rounded-full border border-white/16" />
              <div className="absolute -left-10 -top-6 h-48 w-48 rounded-full border border-white/12" />
              <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="flex items-center justify-center">
                  <Image
                    src={featuredProducts.statement.heroImage}
                    alt={featuredProducts.statement.name}
                    className="max-h-[22rem] w-auto object-contain drop-shadow-[0_30px_34px_rgba(0,0,0,0.24)]"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/62">
                    Featured speaker
                  </p>
                  <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.08em]">
                    {featuredProducts.statement.shortName}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/78 sm:text-base">
                    Upgrade to premium speakers built to deliver scale, texture, and a room-filling
                    sense of presence without cluttering the interface or your setup.
                  </p>
                  <Link href={`/products/${featuredProducts.statement.slug}`} className="mt-8 inline-flex">
                    <Button variant="quaternary">See product</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Link
                href={`/products/${featuredProducts.compact.slug}`}
                className="group overflow-hidden rounded-[2.4rem] border border-black/6 bg-[#ece4d8] p-8 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(16,18,25,0.1)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                  Compact setup
                </p>
                <div className="mt-5 flex items-center justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-[0.08em]">
                      {featuredProducts.compact.shortName}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-black/60">
                      A tighter footprint with premium wireless bookshelf performance.
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#d87d4a] transition group-hover:translate-x-1" />
                </div>
              </Link>

              <div className="overflow-hidden rounded-[2.4rem] border border-black/6 bg-white">
                <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[18rem] bg-[#ece4d8]">
                    <Image
                      src={featuredProducts.portable.heroImage}
                      alt={featuredProducts.portable.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                      Portable pick
                    </p>
                    <h3 className="mt-4 text-2xl font-black uppercase tracking-[0.08em]">
                      {featuredProducts.portable.shortName}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-black/60">
                      Wireless earphones designed for movement, clarity, and all-day comfort.
                    </p>
                    <Link href={`/products/${featuredProducts.portable.slug}`} className="mt-6">
                      <Button variant="secondary">See product</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                Curated products
              </p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">
                Built for category-first shopping
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black/55 shadow-[0_16px_30px_rgba(16,18,25,0.06)]">
              <Sparkles className="h-4 w-4 text-[#d87d4a]" />
              Better cards, faster scan, cleaner hierarchy
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {curatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <ActionCard />
      <Footer />
    </div>
  );
}
