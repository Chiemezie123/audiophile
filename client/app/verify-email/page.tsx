"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import LogoIcon from "@/assets/svg/Logo.svg";
import { Button } from "@/components/ui/button";
import OtpInput from "@/components/ui/otpInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setOtp,
  setOtpVerified,
  setLoading,
  setError,
  clearError,
  SignupStep,
  setCurrentStep,
} from "@/store/signupSlice";
import { useRouter } from "next/navigation";
import { toastUtils } from "@/lib/toastUtils";

const page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { signupData, otp, loading, error, otpSent, currentStep } =
    useAppSelector((state) => state.signup);

  const [otpValue, setOtpValue] = useState("");

  // Redirect if no email in signup data
  useEffect(() => {
    if (!signupData.email || !otpSent) {
      router.push("/signup");
    }
  }, [signupData.email, otpSent, router]);

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    dispatch(setOtp(value));
  };

  const handleVerifyEmail = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toastUtils.error("Please enter a valid 6-digit code");
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    const loadingToast = toastUtils.loading("Verifying code...");

    try {
      const response = await fetch(
        "http://127.0.0.1:4000/api/v1/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
            otp: otpValue,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(setOtpVerified(true));
        dispatch(setCurrentStep(SignupStep.PASSWORD_INPUT));

        toastUtils.updateLoading(
          loadingToast,
          "✅ Email verified successfully!",
          "success"
        );

        // Redirect back to signup page for password step
        setTimeout(() => {
          router.push("/signup");
        }, 1000);
      } else {
        const errorMessage =
          result.message || "Invalid verification code. Please try again.";
        dispatch(setError(errorMessage));
        toastUtils.updateLoading(loadingToast, `❌ ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      dispatch(setError(errorMessage));
      toastUtils.updateLoading(loadingToast, `🔴 ${errorMessage}`, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendOtp = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    const loadingToast = toastUtils.loading("Resending verification code...");

    try {
      const response = await fetch(
        "http://127.0.0.1:4000/api/v1/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toastUtils.updateLoading(
          loadingToast,
          "📧 Verification code sent again!",
          "success"
        );
        setOtpValue(""); // Clear current OTP input
        dispatch(setOtp(""));
      } else {
        const errorMessage =
          result.message || "Failed to resend verification code.";
        dispatch(setError(errorMessage));
        toastUtils.updateLoading(loadingToast, `❌ ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage =
        "Network error. Please check your connection and try again.";
      dispatch(setError(errorMessage));
      toastUtils.updateLoading(loadingToast, `🔴 ${errorMessage}`, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!signupData.email) {
    return null; // Will redirect to signup
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full py-[74.5px] pl-[104px]">
          <Image src={LogoIcon} alt="Logo" width={143} height={25} />
        </div>
        <div className="p-4 w-[543px] flex flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-semibold leading-[120%] text-gray-900">
              Verify your email
            </h3>
            <p className="text-[16px] text-gray-700">
              Enter the 6 digit code that was sent to{" "}
              <span className="font-semibold">{signupData.email}</span>
            </p>
          </div>
          <div>
            <OtpInput value={otpValue} onChange={handleOtpChange} />
          </div>

          {/* Show error if any */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleVerifyEmail}
                disabled={loading || otpValue.length !== 6}
                className="w-full rounded-[32px] capitalize text-[16px] my-6 py-9 font-semibold disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
