import Link from "next/link";
import { ChevronRight, ShieldCheck, UserRound } from "lucide-react";

export default function MyAccountPage() {
  return (
    <main className="min-h-screen bg-[#0f1115] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,125,74,0.16),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f1c2a4]">
            My Account
          </p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Your FuzzyBeats profile, preferences, and order access.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
                Keep your account details current so checkout stays fast and your
                orders remain easy to manage across devices.
              </p>
            </div>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/6">
              <UserRound className="h-7 w-7 text-[#d87d4a]" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-[1.7rem] border border-white/8 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d87d4a]/14 text-[#d87d4a]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Profile Security</h2>
                <p className="text-sm text-white/52">
                  Update your personal details and sign-in settings.
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-white/64">
              This area is ready for profile management as the account section
              expands. Your authentication flow remains active and connected.
            </p>
          </section>

          <section className="rounded-[1.7rem] border border-white/8 bg-[#15171c] p-6">
            <h2 className="text-lg font-bold">Continue Shopping</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Browse the full product range or jump straight to your saved cart
              and checkout flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/categories/headphones"
                className="inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b]"
              >
                Shop Headphones
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:border-white/20 hover:bg-white hover:text-[#131418]"
              >
                View Checkout
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
