import Image from "next/image";

import CategoryCard from "@/components/ui/CategoryCard";
import ProductCard from "@/components/ui/ProductCard";
import ActionCard from "./ActionCard";
import Footer from "./Footer";
import Header from "./Header";
import {
  type CategorySlug,
  categoryMeta,
  homeCategoryCards,
  type Product,
} from "@/lib/catalog";

type CategoryProps = {
  category: CategorySlug;
  products: Product[];
};

const Category = ({ category, products }: CategoryProps) => {
  const meta = categoryMeta[category];

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
      <Header />

      <section className="border-b border-black/6 bg-[#111215] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9a07d]">
              Category
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase tracking-[0.08em] sm:text-5xl">
              {meta.name}
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
              {meta.headline}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
              {meta.description}
            </p>
          </div>

          <div className="relative flex min-h-[16rem] items-center justify-center rounded-[2rem] border border-white/10 bg-white/6 p-8">
            <div className="absolute inset-x-10 top-10 h-24 rounded-full bg-[#d87d4a]/20 blur-3xl" />
            <Image
              src={meta.heroImage}
              alt={meta.name}
              className="relative max-h-72 w-auto object-contain drop-shadow-[0_28px_32px_rgba(0,0,0,0.28)]"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                Browse next
              </p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">
                Explore more categories
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {homeCategoryCards.map((card) => (
              <CategoryCard
                key={card.category}
                image={card.image}
                label={card.label}
                href={`/categories/${card.category}`}
                eyebrow={card.category === category ? "Current focus" : "Browse category"}
              />
            ))}
          </div>
        </section>
      </main>

      <ActionCard />
      <Footer />
    </div>
  );
};

export default Category;
