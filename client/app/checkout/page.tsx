"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";

import RadioButton from "@/components/ui/radioButton";
import { Input } from "@/components/ui/textIpnut";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/ui/CheckoutModal";
import Footer from "@/features/Footer";
import Header from "@/features/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getCartProducts } from "@/lib/cart";
import { clearCart } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const SHIPPING_COST = 50;

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"e-money" | "cash">(
    "e-money"
  );
  const [checkoutData, setCheckoutData] = useState({
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    shippingAddress: "",
    shippingZipCode: "",
    shippingCity: "",
    shippingCountry: "",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const items = useMemo(() => getCartProducts(cartItems), [cartItems]);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const vat = Math.round(subtotal * 0.2);
  const grandTotal = subtotal + SHIPPING_COST;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signup");
    }
  }, [isAuthenticated, router]);

  const handleInputChange =
    (field: keyof typeof checkoutData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckoutData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    for (const [field, value] of Object.entries(checkoutData)) {
      if (!value.trim()) {
        toast.error(`${field} is required.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/v1/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ items: cartItems }),
      });

      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...checkoutData,
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Unable to place order.");
        return;
      }

      dispatch(clearCart());
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Unable to place order right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F1F1F1]">
      <Header />
      <div className="mx-auto mb-6 mt-4 max-w-[1110px] px-4 lg:mb-14 lg:mt-20">
        <button
          type="button"
          className="text-sm opacity-50"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>

      <div className="mx-auto max-w-[1110px] px-4">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full rounded-md bg-[#FFFFFF] px-8 py-12 lg:w-[730px]">
            <h1 className="h3 font-bold uppercase">Checkout</h1>
            <div className="mt-10.25 flex flex-col gap-4">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Billing Details
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <Input
                    placeholder="Alexei Ward"
                    label="Name"
                    value={checkoutData.billingName}
                    onChange={handleInputChange("billingName")}
                  />
                  <Input
                    placeholder="alexei@mail.com"
                    label="Email Address"
                    value={checkoutData.billingEmail}
                    onChange={handleInputChange("billingEmail")}
                  />
                </div>
                <Input
                  placeholder="+1 202-555-0136"
                  label="Phone Number"
                  value={checkoutData.billingPhone}
                  onChange={handleInputChange("billingPhone")}
                />
              </div>
            </div>
            <div className="mt-13.25 flex flex-col gap-4">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Shipping Info
              </h3>
              <Input
                placeholder="1137 Williams Avenue"
                label="Address"
                className="max-w-full"
                value={checkoutData.shippingAddress}
                onChange={handleInputChange("shippingAddress")}
              />
              <div className="flex flex-col gap-4 md:flex-row">
                <Input
                  placeholder="10001"
                  label="Zip Code"
                  value={checkoutData.shippingZipCode}
                  onChange={handleInputChange("shippingZipCode")}
                />
                <Input
                  placeholder="New York"
                  label="City"
                  value={checkoutData.shippingCity}
                  onChange={handleInputChange("shippingCity")}
                />
              </div>
              <Input
                placeholder="United States"
                label="Country"
                value={checkoutData.shippingCountry}
                onChange={handleInputChange("shippingCountry")}
              />
            </div>
            <div className="mt-15.25 flex flex-col gap-4">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Payment Details
              </h3>
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <h6 className="text-[12px] font-Bold">Payment Method</h6>
                <div className="flex flex-col gap-4">
                  <RadioButton
                    label="e-Money"
                    value="e-money"
                    isActive={paymentMethod === "e-money"}
                    onClick={(value) =>
                      setPaymentMethod(value as "e-money" | "cash")
                    }
                  />
                  <RadioButton
                    label="Cash on Delivery"
                    value="cash"
                    isActive={paymentMethod === "cash"}
                    onClick={(value) =>
                      setPaymentMethod(value as "e-money" | "cash")
                    }
                  />
                </div>
              </div>
              {paymentMethod === "e-money" ? (
                <div className="flex flex-col gap-4 md:flex-row">
                  <Input placeholder="238521993" label="e-Money Number" />
                  <Input placeholder="6891" label="e-Money PIN" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mb-[116px] flex w-full flex-col gap-8 rounded-md bg-[#FFFFFF] px-8.25 py-8 lg:mb-0 lg:w-[350px]">
            <h3 className="h6 font-Bold uppercase">Summary</h3>

            {items.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#f7f4ef] px-5 py-8 text-sm text-black/55">
                Your cart is empty. Add products before proceeding to checkout.
              </div>
            ) : (
              <div className="my-1 flex flex-col gap-6">
                {items.map(({ product, quantity, lineTotal }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[8px] bg-[#F1F1F1]">
                        <Image
                          src={product.cardImage}
                          alt={product.name}
                          className="max-h-[40px] w-auto object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-Bold uppercase">
                          {product.shortName}
                        </p>
                        <p className="text-sm opacity-50">
                          ${lineTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <h6>{quantity}x</h6>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase leading-[25px] opacity-50">
                    Total
                  </p>
                  <p className="h6 font-bold">${subtotal.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase leading-[25px] opacity-50">
                    Shipping
                  </p>
                  <p className="h6 font-bold">
                    ${SHIPPING_COST.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase leading-[25px] opacity-50">
                    Vat included
                  </p>
                  <p className="h6 font-bold">${vat.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase leading-[25px] opacity-50">
                  Grand Total
                </p>
                <p className="h6 font-bold text-[#D87D4A]">
                  ${grandTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={items.length === 0 || isSubmitting}
              onClick={handlePlaceOrder}
            >
              {isSubmitting ? "Processing..." : "Continue & Pay"}
            </Button>
            {modalOpen ? (
              <CheckoutModal
                handleModalCloser={() => setModalOpen(false)}
                items={items}
                grandTotal={grandTotal}
                onComplete={() => dispatch(clearCart())}
              />
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
