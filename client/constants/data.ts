import { Heart, Package2, UserRound } from "lucide-react";

interface AccountModalData {
  title: string;
  imgSrc: React.ComponentType;
  href: string;
  alt: string;
}

export const accountModalData: AccountModalData[] = [
  {
    title: "my account",
    imgSrc: UserRound,
    href: "/my-account",
    alt: "Sign up",
  },
  {
    title: "my orders",
    imgSrc: Package2,
    href: "/my-orders",
    alt: "Login",
  },
  {
    title: "wishlist",
    imgSrc: Heart,
    href: "/wishlist",
    alt: "Forgot Password",
  },
];
