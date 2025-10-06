import React, { useEffect, useRef } from "react";
import SizeInputHandler from "./sizeInputHandler";
import { Button } from "./button";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones4 from "@/assets/Headphones4.png";
import Earphones from "@/assets/Earphones.png";
import Image from "next/image";
import Link from "next/link";

interface CartModalProps {
  handleModalCloser: () => void;
}

const CartModal = ({ handleModalCloser }: CartModalProps) => {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        handleModalCloser?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleModalCloser]);
  return (
    <div
      className="fixed top-0 left-0 bg-[rgba(0,0,0,0.4)] w-full h-full z-100"
      onClick={handleModalCloser}
      ref={modalRef}
    >
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto relative">
        <div
          className="absolute xs:top-26 lg:top-30.5 right-0 bg-white xs:w-full md:w-[377px]  py-8 pl-[33px] pr-[31px] rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="h6 font-Bold uppercase leading-[25px]">
                Cart (3)
              </h2>
              <h6 className="underline cursor-pointer text-sm opacity-50">
                Remove all
              </h6>
            </div>
            <div className="flex flex-col gap-6 my-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#F1F1F1] flex items-center justify-center rounded-[8px] w-[64px] h-[64px]">
                    <Image
                      src={Headphones3}
                      alt="Headphones 3"
                      width={38}
                      height={40}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-Bold uppercase">XX99 Mk II</p>
                    <p className="text-sm opacity-50">$ 2,999</p>
                  </div>
                </div>
                <SizeInputHandler />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#F1F1F1] flex items-center justify-center rounded-[8px] w-[64px] h-[64px]">
                    <Image
                      src={Headphones4}
                      alt="Headphones 2"
                      width={38}
                      height={40}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-Bold uppercase">XX59</p>
                    <p className="text-sm opacity-50">$ 899</p>
                  </div>
                </div>
                <SizeInputHandler />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#F1F1F1] flex items-center justify-center rounded-[8px] w-[64px] h-[64px]">
                    <Image
                      src={Earphones}
                      alt="Earphones"
                      width={38}
                      height={40}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-Bold uppercase">YX1</p>
                    <p className="text-sm opacity-50">$ 599</p>
                  </div>
                </div>
                <SizeInputHandler />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-50 uppercase leading-[25px]">
                Total
              </p>
              <p className="h6 font-bold">$ 5,396</p>
            </div>
            <Link href="/checkout">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
