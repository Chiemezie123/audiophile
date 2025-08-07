import React from "react";
import CartIcon from "@/assets/svg/Cart.svg?react";
import LogoIcon from "@/assets/svg/Logo.svg?react";
import HamburgerIcon from "@/assets/svg/Hamburger.svg?react";

const Header = () => {
  return (
    <div className="bg-[#141414]">
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex items-center justify-between py-8 border-b-2 border-[rgba(255,255,255,0.2)] border-opacity-20  ">
          <div className=" flex items-center gap-10">
            <HamburgerIcon className="lg:hidden xs:block" />
            <LogoIcon className="xs:hidden md:block" />
          </div>
          <LogoIcon className="xs:block md:hidden" />
          <ul className=" xs:hidden md:hidden lg:inline-flex gap-8.5 pr-0.5 justify-center items-start text-xs uppercase text-white ">
            <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
              Home
            </li>
            <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
              Headphones
            </li>
            <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
              Speakers
            </li>
            <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
              Earphones
            </li>
          </ul>
          <CartIcon />
        </div>
      </div>
    </div>
  );
};

export default Header;
