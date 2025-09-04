import React from "react";
import { Button } from "./button";
import Image from "next/image";
import Checkmark from "@/assets/svg/Checkmark.svg?react";
import Headphones3 from "@/assets/Headphones3.png";
import Link from "next/link";

interface CheckoutModalProps {
  handleModalCloser: () => void;
}

const CheckoutModal = ({ handleModalCloser }: CheckoutModalProps) => {
  return (
    <div>
      <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.4)] w-full h-full z-100 flex justify-center items-center">
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
          <div
            className="bg-white xs:w-full py-8 px-8 rounded-lg flex flex-col gap-8.25"
            // onClick={(e) => e.stopPropagation()}
          >
            <Checkmark />
            <div className="flex flex-col gap-6">
              <h1 className="xs:h5 md:h3 font-Bold uppercase">
                Thank you <br></br> for your order
              </h1>
              <p className="xs:text-xs md:text-sm opacity-50 leading-6.25">
                You will receive an email confirmation shortly.
              </p>
            </div>
            <div className="flex flex-col xs:gap-5.75 md:gap-11.5">
              <div className="flex xs:flex-col md:flex-row md:h-[140px]">
                <div className="bg-[#F1F1F1] xs:w-full md:w-[246px] xs:rounded-t-md md:rounded-r-none md:rounded-l-md flex flex-col justify-center items-center gap-2 p-6">
                  <div className="flex justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#F1F1F1] flex items-center justify-center rounded-md w-[50px] h-[50px]">
                        <Image
                          src={Headphones3}
                          alt="Headphones 3"
                          width={28}
                          height={32}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-Bold uppercase">
                          XX99 Mk II
                        </p>
                        <p className="text-sm opacity-50">$ 2,999</p>
                      </div>
                    </div>
                    <h6 className="pt-0.5 opacity-50 font-Bold">x1</h6>
                  </div>
                  <div className="w-full border-t border-[#00000014] text-center text-[12px] font-Bold opacity-50 pt-2">
                    and 2 other item(s)
                  </div>
                </div>
                <div className="bg-[#000000] xs:w-full xs:h-[92px] md:h-full md:w-[198px] xs:rounded-b-md md:rounded-l-none md:rounded-r-md text-white flex flex-col gap-2 xs:pl-6 md:pl-8 xs:pt-3.75 md:pt-10.25">
                  <h6 className="text-sm opacity-50 uppercase">Grand Total</h6>
                  <h6 className="h6 font-Bold">$5,446</h6>
                </div>
              </div>
              <Link href="/">
              <Button className="w-full" onClick={handleModalCloser}>
                Back to Home
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
