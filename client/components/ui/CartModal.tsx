"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import SizeInputHandler from "./sizeInputHandler";
import { Button } from "./button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart, removeFromCart, updateCartItemQuantity } from "@/store/cartSlice";
import { fetchCatalogProductsBySlugs } from "@/lib/catalog-api";
import { getProductImageSrc, type Product } from "@/lib/catalog";
import { useAuth } from "@/contexts/AuthContext";

interface CartModalProps {
  handleModalCloser: () => void;
}

const CartModal = ({ handleModalCloser }: CartModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [catalogProducts, setCatalogProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchCatalogProductsBySlugs(
        cartItems.map((item) => item.productSlug)
      );

      setCatalogProducts(
        products.reduce<Record<string, Product>>((accumulator, product) => {
          accumulator[product.slug] = product;
          return accumulator;
        }, {})
      );
    };

    void loadProducts();
  }, [cartItems]);

  const items = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = catalogProducts[item.productSlug];
          if (!product) {
            return null;
          }

          return {
            product,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter(
          (
            item
          ): item is {
            product: Product;
            quantity: number;
            lineTotal: number;
          } => Boolean(item)
        ),
    [cartItems, catalogProducts]
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleModalCloser();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleModalCloser]);


  
  const handleCheckout = () => {
    handleModalCloser();
    router.push(isAuthenticated ? "/checkout" : "/signup");
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.45)] px-4 py-24 sm:px-6"
      onClick={handleModalCloser}
    >
      <div className="mx-auto max-w-[1180px]">
        <div
          ref={modalRef}
          className="ml-auto w-full max-w-[28rem] rounded-[2rem] bg-white p-6 shadow-[0_28px_70px_rgba(16,18,25,0.22)] sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black uppercase tracking-[0.1em] text-[#15161a]">
              Cart ({itemCount})
            </h2>
            {items.length > 0 ? (
              <button
                type="button"
                className="text-sm text-black/48 underline transition hover:text-[#d87d4a]"
                onClick={() => dispatch(clearCart())}
              >
                Remove all
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-black/10 bg-[#f7f4ef] px-6 py-10 text-center">
              <p className="text-sm leading-7 text-black/55">
                Your cart is empty. Add a product from any detail page and it will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex max-h-[22rem] flex-col gap-4 overflow-y-auto pr-1">
                {items.map(({ product, quantity, lineTotal }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-[1.3rem] bg-[#f7f4ef] p-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-[#ece4d8] p-2">
                      <img
                        src={getProductImageSrc(product.cardImage)}
                        alt={product.name}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold uppercase tracking-[0.08em] text-[#15161a]">
                        {product.shortName}
                      </p>
                      <p className="mt-1 text-sm text-black/48">
                        ${lineTotal.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        className="text-black/35 transition hover:text-[#d87d4a]"
                        onClick={() => dispatch(removeFromCart(product.slug))}
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <SizeInputHandler
                        value={quantity}
                        min={1}
                        className="h-10 w-[108px] gap-2 rounded-full bg-white"
                        onChange={(value) =>
                          dispatch(
                            updateCartItemQuantity({
                              productSlug: product.slug,
                              quantity: value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-black/40">
                  Total
                </p>
                <p className="text-2xl font-black text-[#15161a]">
                  ${subtotal.toLocaleString()}
                </p>
              </div>

              <Button className="mt-6 w-full" onClick={handleCheckout}>
                {isAuthenticated ? "Checkout" : "Sign up to checkout"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
