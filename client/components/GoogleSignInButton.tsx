"use client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/svg/Google.svg";
import {
  GUEST_CART_STORAGE_KEY,
  MERGE_GUEST_CART_FLAG_KEY,
} from "@/lib/cart-storage";

interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  text = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const handleGoogleSignIn = () => {
    try {
      const guestCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
      const parsedGuestCart = guestCart ? JSON.parse(guestCart) : [];

      if (Array.isArray(parsedGuestCart) && parsedGuestCart.length > 0) {
        window.localStorage.setItem(MERGE_GUEST_CART_FLAG_KEY, "1");
      }
    } catch {
      window.localStorage.removeItem(MERGE_GUEST_CART_FLAG_KEY);
    }

    window.location.href = "/api/v1/auth/google";
  };

  return (
    <Button
      type="button"
      variant="tertiary"
      onClick={handleGoogleSignIn}
      className={`w-full border-2 border-[#D7DAE0] py-3 px-16 rounded-[32px] flex items-center justify-center gap-4 text-[14px] text-black font-semibold hover:bg-gray-50 ${className}`}
    >
      <GoogleIcon />
      <span>{text}</span>
    </Button>
  );
}
