"use client";
import AuthForm from "@/features/AuthForm";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { toastUtils } from "@/lib/toastUtils";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setEmail,
  setPassword,
  setCurrentStep,
  setLoading,
  setError,
  clearError,
  setOtpSent,
  SignupStep,
} from "@/store/signupSlice";
import { setUser } from "@/store/userSlice";

// Validation schemas for different steps
const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const passwordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Password must correlate"),
});

interface EmailFormData {
  email: string;
}

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentStep, signupData, loading, error, otpVerified } =
    useAppSelector((state) => state.signup);

  // Determine which form to show based on current step and OTP verification
  const isEmailStep = currentStep === SignupStep.EMAIL_INPUT;
  const isPasswordStep =
    currentStep === SignupStep.PASSWORD_INPUT ||
    (currentStep === SignupStep.EMAIL_INPUT && otpVerified);

  // Email form setup
  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailValidationSchema),
    defaultValues: {
      email: signupData.email || "",
    },
  });

  // Password form setup
  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordValidationSchema),
    defaultValues: {
      password: signupData.password || "",
      confirmPassword: signupData.confirmPassword || "",
    },
  });

  // Check if user came back from email verification
  useEffect(() => {
    if (otpVerified && currentStep === SignupStep.EMAIL_INPUT) {
      dispatch(setCurrentStep(SignupStep.PASSWORD_INPUT));
    }
  }, [otpVerified, currentStep, dispatch]);

  // Handle invalid form submission (validation errors)
  const onInvalidSubmit = (errors: any) => {
    toastUtils.validationErrors(errors);
  };

  // Email submission handler
  const onEmailSubmit = async (data: EmailFormData) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    const loadingToast = toastUtils.loading("Sending verification code...");

    try {
      // Save email to Redux store
      dispatch(setEmail(data.email));

      // Send OTP to email
      const response = await fetch(
        "http://127.0.0.1:4000/api/v1/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(setOtpSent(true));
        toastUtils.updateLoading(
          loadingToast,
          "📧 Verification code sent to your email!",
          "success"
        );

        // Redirect to email verification page
        router.push("/verify-email");
      } else {
        const errorMessage =
          result.message || "Failed to send verification code.";
        dispatch(setError(errorMessage));
        toastUtils.updateLoading(loadingToast, `❌ ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      dispatch(setError(errorMessage));
      toastUtils.updateLoading(loadingToast, `🔴 ${errorMessage}`, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Password submission handler
  const onPasswordSubmit = async (data: PasswordFormData) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    const loadingToast = toastUtils.loading("Creating your account...");

    try {
      // Save password to Redux store
      dispatch(setPassword(data));

      // Create account with email and password
      const response = await fetch(
        "http://127.0.0.1:4000/api/v1/auth/set-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Account created successfully:", result);

        // Store user data in Redux store (handles partial user data)
        if (result.user) {
          const userData = {
            id: result.user._id || result.user.id,
            email: result.user.email,
            firstName: result.user.firstName || "",
            lastName: result.user.lastName || "",
            photo: result.user.photo || "",
            authProvider: result.user.authProvider || "local",
            isEmailVerified: result.user.isEmailVerified || true, // Since they completed OTP verification
            role: result.user.role || "user",
          };
          dispatch(setUser(userData));
        }

        toastUtils.updateLoading(
          loadingToast,
          "🎉 Account created successfully! Welcome to Audiophile!",
          "success"
        );

        // Move to profile completion step
        dispatch(setCurrentStep(SignupStep.PROFILE_COMPLETION));

        // Check if user needs to complete profile (missing firstName or lastName)
        const needsProfileCompletion =
          !result.user?.firstName || !result.user?.lastName;

        if (needsProfileCompletion) {
          // Redirect to profile completion page
          setTimeout(() => {
            router.replace("/complete-profile", { scroll: false });
          }, 1500);
        } else {
          // User has complete profile, redirect to home
          setTimeout(() => {
            router.replace("/", { scroll: false });
          }, 1500);
        }
      } else {
        const errorMessage =
          result.message || "Failed to create account. Please try again.";
        dispatch(setError(errorMessage));
        toastUtils.updateLoading(loadingToast, `❌ ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      dispatch(setError(errorMessage));
      toastUtils.updateLoading(loadingToast, `🔴 ${errorMessage}`, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div>
      {/* Email Step */}
      {isEmailStep && !otpVerified && (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit, onInvalidSubmit)}>
          <AuthForm
            title="Create Account"
            inputs={[
              {
                label: "Email",
                type: "email",
                id: "email",
                placeholder: "Enter your email",
                className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
                name: "email" as const,
                register: emailForm.register as any,
                errorMsg: emailForm.formState.errors.email?.message,
              },
            ]}
            buttonText={loading ? "Sending Code..." : "Send Verification Code"}
            bottomText="Already have an account?"
            hrefPath="/login"
            linkText="Log in"
            helper={{ type: "text" }}
            isSubmitting={loading}
          />
        </form>
      )}

      {/* Password Step - shown after email verification */}
      {(isPasswordStep || otpVerified) && (
        <form
          onSubmit={passwordForm.handleSubmit(
            onPasswordSubmit,
            onInvalidSubmit
          )}
        >
          <AuthForm
            title="Complete Your Account"
            inputs={[
              {
                label: "Email",
                type: "email",
                id: "email-readonly",
                placeholder: signupData.email || "",
                className:
                  "max-w-full bg-gray-100 rounded-md h-[45px] cursor-not-allowed",
                name: "email" as const,
                register: passwordForm.register as any, // Read-only field
                errorMsg: "",
                disabled: true,
              },
              {
                label: "Password",
                type: "password",
                id: "password",
                placeholder: "Enter your password",
                className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
                name: "password" as const,
                register: passwordForm.register as any,
                errorMsg: passwordForm.formState.errors.password?.message,
              },
              {
                label: "Confirm Password",
                type: "password",
                id: "confirmPassword",
                placeholder: "Confirm your password",
                className: "max-w-full bg-[#F6F7F9] rounded-md h-[45px]",
                name: "confirmPassword" as const,
                register: passwordForm.register as any,
                errorMsg:
                  passwordForm.formState.errors.confirmPassword?.message,
              },
            ]}
            buttonText={loading ? "Creating Account..." : "Create Account"}
            bottomText="Already have an account?"
            hrefPath="/login"
            linkText="Log in"
            helper={{ type: "text" }}
            isSubmitting={loading}
          />
        </form>
      )}

      {/* Show error if any */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Page;
