"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateCart } from "@/store/cartSlice";

const STORAGE_KEY = "fuzzybeats-cart";

const CartSync = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const hydrated = useAppSelector((state) => state.cart.hydrated);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
      dispatch(hydrateCart([]));
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart);
      dispatch(hydrateCart(Array.isArray(parsedCart) ? parsedCart : []));
    } catch {
      dispatch(hydrateCart([]));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  return null;
};

export default CartSync;
