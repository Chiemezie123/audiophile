"use client";

import RadioButton from "@/components/ui/radioButton";
import { Input } from "@/components/ui/textIpnut";
import Footer from "@/features/Footer";
import Header from "@/features/Header";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones4 from "@/assets/Headphones4.png";
import Earphones from "@/assets/Earphones.png";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CheckoutModal from "@/components/ui/CheckoutModal";

const page = () => {
    const [modalOpen, setModalOpen] = useState(false);
    
      const handleModalOpener = () => {
        setModalOpen(true);
      };
    
      const handleModalCloser = () => {
        setModalOpen(false);
      };

  return (
    <div className="bg-[#F1F1F1]">
      <Header />
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto md:mt-[33px] xs:mt-4 xs:mb-6 lg:mt-20 lg:mb-14">
        <button className="text-sm opacity-50">Go Back</button>
      </div>

      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex xs:flex-col lg:flex-row gap-7.5">
          <div className="xs:w-full lg:w-[730px] h-[1126px md:mb-0 lg:mb-[141px] bg-[#FFFFFF] pt-14 pb-12 px-12 rounded-md">
            <h1 className="h3 font-bold uppercase">Checkout</h1>
            <div className="flex flex-col gap-4 mt-10.25">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Billing Details
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex xs:flex-col md:flex-row gap-4">
                  <Input placeholder="Alexei Ward" label="Name" />
                  <Input placeholder="alexei@mail.com" label="Email Address" />
                </div>
                <Input placeholder="+1 202-555-0136" label="Phone Number" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-13.25">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Shipping Info
              </h3>
              <Input
                placeholder="1137 Williams Avenue"
                label="Address"
                className="max-w-full"
              />
              <div className="flex xs:flex-col md:flex-row gap-4">
                <Input placeholder="10001" label="Zip Code" />
                <Input placeholder="New York" label="City" />
              </div>
              <Input placeholder="United States" label="Country" />
            </div>
            <div className="flex flex-col gap-4 mt-15.25">
              <h3 className="text-[13px] font-Bold uppercase text-[#D87D4A]">
                Payment Details
              </h3>
              <div className="flex xs:flex-col md:flex-row xs:gap-4.25 md:justify-between">
                <h6 className="text-[12px] font-Bold">Payment Method</h6>
                <div className="flex flex-col gap-4">
                  <RadioButton
                    label="e-Money"
                    value="e-money"
                    isActive
                    onClick={() => {}}
                  />
                  <RadioButton
                    label="Cash on Delivery"
                    value="cash"
                    isActive={false}
                    onClick={() => {}}
                  />
                  {/* I changed the width from 240px to 309px to fit the figma file. */}
                  {/* I changed it back, cos it's messing up with the responsive design */}
                </div>
              </div>
              <div className="flex xs:flex-col md:flex-row gap-4">
                <Input placeholder="238521993" label="e-Money Number" />
                <Input placeholder="6891" label="e-Money PIN" />
              </div>
            </div>
          </div>

          <div className="xs:w-full lg:w-[350px] h-[612px] bg-[#FFFFFF] px-8.25 py-8 xs:mb-[116px] lg:mb-0 flex flex-col gap-8 rounded-md">
            <h3 className="h6 font-Bold uppercase">Summary</h3>
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
                <h6>1x</h6>
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
                <h6>2x</h6>
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
                <h6>1x</h6>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-50 uppercase leading-[25px]">
                    Total
                  </p>
                  <p className="h6 font-bold">$ 5,396</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-50 uppercase leading-[25px]">
                    Shipping
                  </p>
                  <p className="h6 font-bold">$ 50</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-50 uppercase leading-[25px]">
                    Vat included
                  </p>
                  <p className="h6 font-bold">$ 1,079</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-50 uppercase leading-[25px]">
                  Grand Total
                </p>
                <p className="h6 font-bold text-[#D87D4A]">$ 5,446</p>
              </div>
            </div>

            <Button className="w-full" onClick={handleModalOpener}>Continue & Pay</Button>
            {modalOpen && <CheckoutModal handleModalCloser={handleModalCloser} />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default page;
