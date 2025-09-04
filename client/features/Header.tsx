"use client";
import React, { useState } from "react";
import Image from "next/image";
import CartIcon from "@/assets/svg/Cart.svg?react";
import LogoIcon from "@/assets/svg/Logo.svg";
import HamburgerIcon from "@/assets/svg/Hamburger.svg";
import Link from "next/link";
import account from "@/assets/svg/mdi-light_account.svg";
import SearchMinusIcon from "@/assets/svg/search-minus.svg";
import AccountModal from "./accountModal";

import CartModal from "@/components/ui/CartModal";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpener = () => {
    setModalOpen(true);
  };

  const handleModalCloser = () => {
    setModalOpen(false);
  };

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const toggleAccountModal = () => {
    setIsAccountModalOpen(!isAccountModalOpen);
  };

  return (
    <div className="bg-[#141414]">
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex items-center justify-between py-8 border-b-2 border-[rgba(255,255,255,0.2)]  ">
          <div className=" flex items-center gap-10">
            <Image
              src={HamburgerIcon}
              alt="Menu"
              width={16}
              height={15}
              className="lg:hidden xs:block"
            />
            <Image
              src={LogoIcon}
              alt="Logo"
              width={143}
              height={25}
              className="xs:hidden md:block"
            />
          </div>
          <Image
            src={LogoIcon}
            alt="Logo"
            width={143}
            height={25}
            className="xs:block md:hidden"
          />
          <ul className=" xs:hidden md:hidden lg:inline-flex gap-8.5 pr-0.5 justify-center items-start text-xs uppercase text-white mr-32">
            <Link href="/" passHref>
              <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
                Home
              </li>
            </Link>
            <Link href="/Categories/headphones" passHref>
              <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
                Headphones
              </li>
            </Link>
            <Link href="/Categories/speakers" passHref>
              <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
                Speakers
              </li>
            </Link>
            <Link href="/Categories/earphones" passHref>
              <li className="cursor-pointer hover:text-[var(--color-warm-orange-brown)]">
                Earphones
              </li>
            </Link>
          </ul>
          <div className="flex items-center gap-8 relative">
            <Image src={SearchMinusIcon} alt="Search" width={23} height={20} />
            <button
              onClick={toggleAccountModal}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image src={account} alt="User" width={23} height={20} />
            </button>
            {isAccountModalOpen && (
              <div className="absolute top-12 right-0 z-50">
                <AccountModal onClose={toggleAccountModal} />
              </div>
            )}
            <CartIcon onClick={handleModalOpener} />
            {modalOpen && <CartModal handleModalCloser={handleModalCloser} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
