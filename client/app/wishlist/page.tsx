import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Zap } from "lucide-react";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#0d0f13] px-4 py-10 text-white sm:px-6 lg:px-8">
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
                This section is prepared for saved products, curated favorites,
                and future price-watch experiences.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/6">
              <Heart className="h-7 w-7 text-[#d87d4a]" />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
            <Sparkles className="h-6 w-6 text-[#d87d4a]" />
            <h2 className="mt-5 text-lg font-bold">Curated Favorites</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Keep standout products in one clean, easy-to-return list.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
            <Zap className="h-6 w-6 text-[#d87d4a]" />
            <h2 className="mt-5 text-lg font-bold">Ready for Conversion</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Move saved items into your cart once you are ready to check out.
            </p>
          </div>
        </div>

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
      </div>
    </main>
  );
}
