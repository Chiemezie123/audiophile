import myAccount from "@/assets/user.png";
import myOrders from "@/assets/svg/order.svg";
import whitelist from "@/assets/svg/lucide_star.svg";


interface AccountModalData {
    title: string;
    imgSrc: string;
    href: string;
    alt: string;
}


export const accountModalData: AccountModalData[] = [
    {
        title: "my account",
        imgSrc: myAccount,
        href: "/my-account",
        alt: "Sign up",
    },
    {
        title: "my orders",
        imgSrc: myOrders,
            href: "/my-orders",
        alt: "Login",
    },
    {
        title: "whitelist",
        imgSrc: whitelist,
        href: "/whitelist",
        alt: "Forgot Password",
    }
]