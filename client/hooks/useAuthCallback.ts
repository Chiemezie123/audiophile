"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

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

export const useAuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = () => {
      const authStatus = searchParams.get("auth");
      const userDataParam = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        // Handle OAuth errors
        let errorMessage = "Authentication failed. Please try again.";

        if (error === "oauth_error") {
          errorMessage = "Google authentication error. Please try again.";
        } else if (error === "oauth_failed") {
          errorMessage = "Authentication failed. Please try again.";
        }

        toast.error(errorMessage);
        setIsLoading(false);

        // Clean up URL
        router.replace("/", { scroll: false });
        return;
      }

      if (authStatus === "success" && userDataParam) {
        try {
          // Decode and parse user data
          const userData: User = JSON.parse(decodeURIComponent(userDataParam));

          // Store user data in context (which also handles localStorage)
          setUser(userData);

          // Show success toast
          toast.success(`🎉 Welcome back, ${userData.firstName}!`);

          // Clean up URL parameters
          router.replace("/", { scroll: false });
        } catch (error) {
          console.error("Error parsing user data:", error);
          toast.error(
            "Authentication successful, but failed to load user data."
          );
        }
      }

      setIsLoading(false);
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return { user, isLoading };
};
