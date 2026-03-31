"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "./button";
import type { Product } from "@/lib/catalog";

interface CheckoutModalProps {
  handleModalCloser: () => void;
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  grandTotal: number;
  onComplete?: () => void;
}

const CheckoutModal = ({
  handleModalCloser,
  items,
  grandTotal,
  onComplete,
}: CheckoutModalProps) => {
  const firstItem = items[0];
  const extraItemsCount = Math.max(items.length - 1, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.4)] px-4">
      <div className="w-full max-w-[34rem] rounded-[2rem] bg-white px-8 py-8 shadow-[0_28px_70px_rgba(16,18,25,0.22)]">
        <CheckCircle2 className="h-12 w-12 text-[#d87d4a]" />

        <div className="mt-8 flex flex-col gap-5">
          <h1 className="text-3xl font-black uppercase tracking-[0.08em] text-[#15161a]">
            Thank you for your order
          </h1>
          <p className="text-sm leading-7 text-black/55">
            You will receive an email confirmation shortly.
          </p>
        </div>

        {firstItem ? (
          <div className="mt-8 flex flex-col overflow-hidden rounded-[1.5rem] md:flex-row">
            <div className="flex-1 bg-[#f3efe8] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-white p-2">
                    <Image
                      src={firstItem.product.cardImage}
                      alt={firstItem.product.name}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#15161a]">
                      {firstItem.product.shortName}
                    </p>
                    <p className="text-sm text-black/48">
                      ${firstItem.product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-black/48">
                  x{firstItem.quantity}
                </span>
              </div>

              {extraItemsCount > 0 ? (
                <div className="mt-4 border-t border-black/8 pt-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-black/40">
                  and {extraItemsCount} other item(s)
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-center gap-2 bg-[#111215] px-6 py-6 text-white md:w-[12rem]">
              <h6 className="text-sm uppercase tracking-[0.24em] text-white/48">
                Grand Total
              </h6>
              <h6 className="text-2xl font-black">
                ${grandTotal.toLocaleString()}
              </h6>
            </div>
          </div>
        ) : null}

        <Link href="/" className="mt-8 block">
          <Button
            className="w-full"
            onClick={() => {
              onComplete?.();
              handleModalCloser();
            }}
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutModal;
