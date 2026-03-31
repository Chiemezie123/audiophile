"use client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/svg/Google.svg";

interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  text = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const handleGoogleSignIn = () => {
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
