import Link from "next/link";
import { ArrowRight, PackageCheck, ReceiptText, Truck } from "lucide-react";

export default function MyOrdersPage() {
  return (
    <main className="min-h-screen bg-[#101114] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f1c2a4]">
            Orders
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Order history and fulfillment updates in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
            This screen is ready for your future order timeline. Right now it
            acts as a polished holding state so the account menu remains
            complete and production-safe.
          </p>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
            <PackageCheck className="h-6 w-6 text-[#d87d4a]" />
            <h2 className="mt-5 text-lg font-bold">Placed Orders</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Review completed purchases and product details.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
            <Truck className="h-6 w-6 text-[#d87d4a]" />
            <h2 className="mt-5 text-lg font-bold">Delivery Tracking</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Follow shipment progress once order tracking is connected.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
            <ReceiptText className="h-6 w-6 text-[#d87d4a]" />
            <h2 className="mt-5 text-lg font-bold">Receipts</h2>
            <p className="mt-2 text-sm leading-7 text-white/58">
              Keep invoices and payment summaries easy to access.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[1.7rem] border border-dashed border-white/12 bg-[#15171b] p-6">
          <p className="text-sm leading-7 text-white/60">
            No orders have been attached to this dashboard yet.
          </p>
          <Link
            href="/categories/speakers"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b]"
          >
            Explore Speakers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
