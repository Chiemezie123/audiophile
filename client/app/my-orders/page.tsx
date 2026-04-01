"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/features/Header";
import Footer from "@/features/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getProductBySlug } from "@/lib/catalog";

type Order = {
  id: string;
  status: string;
  grandTotal: number;
  createdAt: string;
  items: Array<{
    productSlug: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signup");
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await fetch("/api/v1/orders", {
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json();
        setOrders(Array.isArray(result.orders) ? result.orders : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [isAuthenticated, router]);

  const totalItems = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + order.items.reduce((acc, item) => acc + item.quantity, 0),
        0
      ),
    [orders]
  );

  return (
    <div className="min-h-screen bg-[#101114] text-white">
      <Header />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#f1c2a4]">
              Orders
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Order history and fulfillment updates in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
              Your purchases are now stored in SQL and available from your account.
            </p>
          </section>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
              <PackageCheck className="h-6 w-6 text-[#d87d4a]" />
              <h2 className="mt-5 text-lg font-bold">Placed Orders</h2>
              <p className="mt-2 text-sm leading-7 text-white/58">
                {loading ? "Loading..." : `${orders.length} order(s) recorded`}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
              <h2 className="text-lg font-bold">Items Purchased</h2>
              <p className="mt-2 text-sm leading-7 text-white/58">
                {loading ? "Loading..." : `${totalItems} total item(s)`}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
              <h2 className="text-lg font-bold">Latest Status</h2>
              <p className="mt-2 text-sm leading-7 text-white/58">
                {orders[0]?.status ? orders[0].status : "No orders yet"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/5 p-6 text-sm text-white/60">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
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
          ) : (
            <div className="mt-8 flex flex-col gap-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                        Order ID
                      </p>
                      <p className="mt-2 text-lg font-black uppercase text-white">
                        {order.id}
                      </p>
                      <p className="mt-2 text-sm text-white/52">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-full border border-[#d87d4a]/30 bg-[#d87d4a]/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f1c2a4]">
                      {order.status}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-5">
                    {order.items.map((item) => {
                      const product = getProductBySlug(item.productSlug);
                      return (
                        <div
                          key={`${order.id}-${item.productSlug}`}
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <div>
                            <p className="font-bold uppercase tracking-[0.08em] text-white">
                              {product?.shortName || item.productSlug}
                            </p>
                            <p className="text-white/52">{item.quantity} item(s)</p>
                          </div>
                          <p className="font-bold text-[#f1c2a4]">
                            ${item.lineTotal.toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-white/42">
                      Grand Total
                    </p>
                    <p className="text-xl font-black text-white">
                      ${order.grandTotal.toLocaleString()}
                    </p>
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
