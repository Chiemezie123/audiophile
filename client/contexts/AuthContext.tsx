"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser as setReduxUser, clearUser } from "@/store/userSlice";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  authProvider: string;
  isEmailVerified: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user);
  const [user, setUser] = useState<User | null>(null);

  // Sync user state with Redux store
  useEffect(() => {
    if (reduxUser.id) {
      const userData: User = {
        id: reduxUser.id,
        firstName: reduxUser.firstName || "",
        lastName: reduxUser.lastName || "",
        email: reduxUser.email || "",
        photo: reduxUser.photo || "",
        authProvider: reduxUser.authProvider || "local",
        isEmailVerified: reduxUser.isEmailVerified || false,
        role: reduxUser.role || "user",
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [reduxUser]);

  useEffect(() => {
    // Load user from localStorage on app start if Redux store is empty
    if (!reduxUser.id) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          dispatch(setReduxUser(parsedUser));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, [dispatch, reduxUser.id]);

  const logout = async () => {
    try {
      // Call logout API
      await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000"
        }/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data from both Redux and local state
      dispatch(clearUser());
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const updateUser = (userData: User | null) => {
    if (userData) {
      // Update Redux store, which will automatically sync with local state
      dispatch(setReduxUser(userData));
    } else {
      dispatch(clearUser());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        isAuthenticated: !!user,
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
