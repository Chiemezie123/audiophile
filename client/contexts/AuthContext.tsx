"use client";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser as setReduxUser, clearUser } from "@/store/userSlice";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  newsletterOptIn: boolean;
  storeCredit: number;
  photo: string;
  authProvider: string;
  isEmailVerified: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartHydrated = useAppSelector((state) => state.cart.hydrated);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    const syncSession = async () => {
      try {
        const response = await fetch("/api/v1/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          dispatch(clearUser());
          return;
        }

        const result = await response.json();
        if (result.user) {
          dispatch(setReduxUser(result.user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Error syncing auth session:", error);
      } finally {
        setIsAuthResolved(true);
      }
    };

    if (!reduxUser.id) {
      void syncSession();
    } else {
      setIsAuthResolved(true);
    }
  }, [dispatch, reduxUser.id]);

  const user = reduxUser.id
    ? ({
        id: reduxUser.id,
        firstName: reduxUser.firstName || "",
        lastName: reduxUser.lastName || "",
        email: reduxUser.email || "",
        phone: reduxUser.phone || "",
        shippingAddress: reduxUser.shippingAddress || "",
        shippingCity: reduxUser.shippingCity || "",
        shippingState: reduxUser.shippingState || "",
        shippingCountry: reduxUser.shippingCountry || "",
        newsletterOptIn: reduxUser.newsletterOptIn ?? true,
        storeCredit: reduxUser.storeCredit || 0,
        photo: reduxUser.photo || "",
        authProvider: reduxUser.authProvider || "local",
        isEmailVerified: reduxUser.isEmailVerified || false,
        role: reduxUser.role || "user",
      } as User)
    : null;

  const logout = useCallback(async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: reduxUser.id && cartHydrated ? cartItems : [],
        }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearUser());
      setIsAuthResolved(true);
    }
  }, [cartHydrated, cartItems, dispatch, reduxUser.id]);

  const updateUser = useCallback((userData: User | null) => {
    if (userData) {
      dispatch(setReduxUser(userData));
    } else {
      dispatch(clearUser());
    }
    setIsAuthResolved(true);
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        isAuthenticated: !!user,
        isAuthResolved,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
