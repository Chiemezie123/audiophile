"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  GUEST_CART_STORAGE_KEY,
  MERGE_GUEST_CART_FLAG_KEY,
} from "@/lib/cart-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateCart } from "@/store/cartSlice";

const CartSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAuthResolved } = useAuth();
  const items = useAppSelector((state) => state.cart.items);
  const hydrated = useAppSelector((state) => state.cart.hydrated);
  const hasInitialized = useRef(false);
  const prevAuthState = useRef<boolean | null>(null);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    if (!isAuthResolved || hasInitialized.current) {
      return;
    }

    const readLocalCart = () => {
      const savedCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);

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

    const fetchRemoteCart = async () => {
      const response = await fetch("/api/v1/cart", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return Array.isArray(result.items) ? result.items : [];
    };

    const initializeCart = async () => {
      if (isAuthenticated) {
        try {
          const remoteCart = await fetchRemoteCart();
          skipNextPersist.current = true;
          dispatch(hydrateCart(remoteCart));
          hasInitialized.current = true;
          prevAuthState.current = true;
          return;
        } catch (error) {
          console.error("Failed to load authenticated cart:", error);
        }
      }

      const localCart = readLocalCart();
      skipNextPersist.current = true;
      dispatch(hydrateCart(localCart));
      hasInitialized.current = true;
      prevAuthState.current = isAuthenticated;
    };

    void initializeCart();
  }, [dispatch, isAuthenticated, isAuthResolved]);

  useEffect(() => {
    if (!hydrated || !hasInitialized.current || !isAuthResolved) {
      return;
    }

    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    if (!isAuthenticated) {
      window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
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
  }, [hydrated, isAuthenticated, isAuthResolved, items]);

  useEffect(() => {
    if (!hasInitialized.current || !isAuthResolved) {
      return;
    }

    if (prevAuthState.current === isAuthenticated) {
      return;
    }

    const previousState = prevAuthState.current;
    prevAuthState.current = isAuthenticated;

    const handleAuthTransition = async () => {
      if (previousState && !isAuthenticated) {
        window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        window.localStorage.removeItem(MERGE_GUEST_CART_FLAG_KEY);
        skipNextPersist.current = true;
        dispatch(hydrateCart([]));
        return;
      }

      if (!previousState && isAuthenticated) {
        const shouldMerge =
          window.localStorage.getItem(MERGE_GUEST_CART_FLAG_KEY) === "1";
        const guestCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
        const parsedGuestCart = guestCart ? JSON.parse(guestCart) : [];

        try {
          if (shouldMerge && Array.isArray(parsedGuestCart) && parsedGuestCart.length > 0) {
            const mergeResponse = await fetch("/api/v1/cart/sync", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ items: parsedGuestCart }),
            });

            if (mergeResponse.ok) {
              const result = await mergeResponse.json();
              window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
              window.localStorage.removeItem(MERGE_GUEST_CART_FLAG_KEY);
              skipNextPersist.current = true;
              dispatch(hydrateCart(Array.isArray(result.items) ? result.items : []));
              return;
            }
          }

          const response = await fetch("/api/v1/cart", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          });

          if (!response.ok) {
            return;
          }

          const result = await response.json();
          window.localStorage.removeItem(MERGE_GUEST_CART_FLAG_KEY);
          skipNextPersist.current = true;
          dispatch(hydrateCart(Array.isArray(result.items) ? result.items : []));
        } catch (error) {
          console.error("Failed to sync cart after auth change:", error);
        }
      }
    };

    void handleAuthTransition();
  }, [dispatch, isAuthenticated, isAuthResolved]);

  return null;
};

export default CartSync;
