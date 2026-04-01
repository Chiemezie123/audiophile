"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateCart } from "@/store/cartSlice";

const STORAGE_KEY = "fuzzybeats-cart";

const CartSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const items = useAppSelector((state) => state.cart.items);
  const hydrated = useAppSelector((state) => state.cart.hydrated);
  const hasInitialized = useRef(false);
  const prevAuthState = useRef<boolean | null>(null);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    const readLocalCart = () => {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      try {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      } catch {
        return [];
      }
    };

    const initializeCart = async () => {
      const localCart = readLocalCart();

      if (isAuthenticated) {
        try {
          const response = await fetch("/api/v1/cart/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ items: localCart }),
          });

          if (response.ok) {
            const result = await response.json();
            skipNextPersist.current = true;
            dispatch(hydrateCart(result.items || []));
            hasInitialized.current = true;
            prevAuthState.current = true;
            return;
          }
        } catch (error) {
          console.error("Failed to sync authenticated cart:", error);
        }
      }

      skipNextPersist.current = true;
      dispatch(hydrateCart(localCart));
      hasInitialized.current = true;
      prevAuthState.current = isAuthenticated;
    };

    if (!hasInitialized.current) {
      void initializeCart();
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    if (!isAuthenticated) {
      return;
    }

    const persistRemoteCart = async () => {
      try {
        await fetch("/api/v1/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ items }),
        });
      } catch (error) {
        console.error("Failed to persist cart:", error);
      }
    };

    void persistRemoteCart();
  }, [hydrated, isAuthenticated, items]);

  useEffect(() => {
    if (!hasInitialized.current) {
      return;
    }

    if (prevAuthState.current === isAuthenticated) {
      return;
    }

    prevAuthState.current = isAuthenticated;

    if (!isAuthenticated) {
      return;
    }

    const syncOnLogin = async () => {
      try {
        const localCart = window.localStorage.getItem(STORAGE_KEY);
        const parsedCart = localCart ? JSON.parse(localCart) : [];

        const response = await fetch("/api/v1/cart/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            items: Array.isArray(parsedCart) ? parsedCart : [],
          }),
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        skipNextPersist.current = true;
        dispatch(hydrateCart(result.items || []));
      } catch (error) {
        console.error("Failed to sync cart after login:", error);
      }
    };

    void syncOnLogin();
  }, [dispatch, isAuthenticated]);

  return null;
};

export default CartSync;
