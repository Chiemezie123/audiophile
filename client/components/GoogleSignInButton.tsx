"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
    // Redirect to server's Google OAuth endpoint
    window.location.href = `${
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000"
    }/api/v1/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className={`w-full border-2 border-[#D7DAE0] py-3 px-16 rounded-[32px] flex items-center justify-center gap-4 text-[14px] text-black font-semibold hover:bg-gray-50 ${className}`}
    >
      <Image src={GoogleIcon} alt="Google" width={20} height={20} />
      <span>{text}</span>
    </Button>
  );
}
