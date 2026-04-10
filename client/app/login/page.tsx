"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import AuthForm from "@/features/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { MERGE_GUEST_CART_FLAG_KEY } from "@/lib/cart-storage";
import { toastUtils } from "@/lib/toastUtils";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/userSlice";

type LoginFormData = {
  email: string;
  password: string;
};

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setUser: setAuthUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const oauth = new URLSearchParams(window.location.search).get("oauth");

    if (!oauth) {
      return;
    }

    const oauthMessages: Record<string, string> = {
      unavailable: "Google sign-in is not configured yet.",
      invalid_state: "Google sign-in session expired. Please try again.",
      token_failed: "Google sign-in failed while exchanging tokens.",
      userinfo_failed: "Google sign-in failed while loading your profile.",
      userinfo_invalid: "Google sign-in returned incomplete profile data.",
      oauth_failed: "Google sign-in failed. Please try again.",
    };

    const message =
      oauthMessages[oauth] || "Google sign-in failed. Please try again.";
    toastUtils.error(message);
    router.replace("/login", { scroll: false });
  }, [router]);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const loadingToast = toastUtils.loading("Signing you in...");

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toastUtils.updateLoading(
          loadingToast,
          `❌ ${result.message || "Unable to sign in."}`,
          "error"
        );
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(MERGE_GUEST_CART_FLAG_KEY, "1");
      }

      dispatch(setUser(result.user));
      setAuthUser(result.user);

      toastUtils.updateLoading(
        loadingToast,
        `🎉 Welcome back, ${result.user.firstName || "there"}!`,
        "success"
      );

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      toastUtils.updateLoading(
        loadingToast,
        "🔴 Network error. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthForm
          title="Log In"
          inputs={[
            {
              label: "Email",
              type: "email",
              id: "email",
              placeholder: "Enter your email",
              className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
              name: "email",
              register: form.register as never,
            },
            {
              label: "Password",
              type: "password",
              id: "password",
              placeholder: "Enter your password",
              className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
              name: "password",
              register: form.register as never,
            },
          ]}
          buttonText={loading ? "Logging In..." : "Log In"}
          bottomText="Don't have an account?"
          hrefPath="/signup"
          linkText="Create an account"
          helper={{ type: "link", href: "/forgot-password" }}
          isSubmitting={loading}
        />
      </form>
    </div>
  );
};

export default Page;
