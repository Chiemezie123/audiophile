import MyAccount from "@/assets/svg/userOriginal.svg?react";
import MyOrders from "@/assets/svg/order.svg?react";
import Whitelist from "@/assets/svg/lucide_star.svg?react";

interface AccountModalData {
  title: string;
  imgSrc: React.ComponentType;
  href: string;
  alt: string;
}

export const accountModalData: AccountModalData[] = [
  {
    title: "my account",
    imgSrc: MyAccount,
    href: "/my-account",
    alt: "Sign up",
  },
  {
    title: "my orders",
    imgSrc: MyOrders,
    href: "/my-orders",
    alt: "Login",
  },
  {
    title: "whitelist",
    imgSrc: Whitelist,
    href: "/whitelist",
    alt: "Forgot Password",
  },
];
