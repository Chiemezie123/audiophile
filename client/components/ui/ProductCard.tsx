import Link from "next/link";

import { getProductImageSrc, type Product } from "@/lib/catalog";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_24px_60px_rgba(16,18,25,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(16,18,25,0.12)] ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div
        className="absolute inset-x-5 top-5 h-28 rounded-full opacity-70 blur-3xl"
        style={{ backgroundColor: product.accent }}
      />
      <div className="relative flex h-full flex-col">
        <div className="relative flex min-h-[14rem] items-center justify-center rounded-[1.5rem] bg-[#f6f3ee] p-6">
          <img
            src={getProductImageSrc(product.cardImage)}
            alt={product.name}
            className="max-h-52 w-auto object-contain drop-shadow-[0_26px_26px_rgba(0,0,0,0.16)] transition duration-300 group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-black/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-black/50">
              {product.category}
            </span>
            {product.isNew ? (
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#d87d4a]">
                New
              </span>
            ) : null}
          </div>

          <div>
            <h3 className="text-lg font-black uppercase tracking-[0.08em] text-[#131418]">
              {product.shortName}
            </h3>
            <p className="mt-2 text-sm leading-6 text-black/60">
              {product.tagline}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                Price
              </p>
              <p className="mt-1 text-lg font-black text-[#16181d]">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="rounded-full bg-[#15161a] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#d87d4a]"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
