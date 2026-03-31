"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toastUtils } from "@/lib/toastUtils";
import AuthForm from "@/features/AuthForm";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/userSlice";
import { useAuth } from "@/contexts/AuthContext";

type LoginFormData = {
  email: string;
  password: string;
};

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setUser: setAuthUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

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
