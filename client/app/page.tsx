"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ArrowRight from "@/assets/svg/arrowRightsvg.svg";
import { Input } from "@/components/ui/textIpnut";
import RadioButton from "../components/ui/radioButton";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import Header from "@/features/Header";
import Footer from "@/features/Footer";
import ActionCard from "@/features/ActionCard";
import Headphones from "../assets/Headphones.png";

export default function Home() {
  return (
    <div className="bg-[#141414] h-screen lg:px-[165px] md:px-[100px] sm:px-[50px] px-4">
      <Header showCart={true} withBorder />
      <section className="lg:flex items-center justify-between h-[calc(100vh-80px)]">
        <div className="w-[395px] flex flex-col gap-6 ">
          <h6 className="text-sm text-[var(--color-white)] opacity-49 tracking-[10px]">
            NEW PRODUCT
          </h6>
          <h1 className="h1 text-[var(--color-white)] uppercase">
            XX99 Mark II Headphones
          </h1>
          <p className="text-sm text-[var(--color-white)] opacity-50 mt-4">
            Experience the ultimate in audio quality with the XX99 Mark II
            Headphones. Designed for audiophiles, these headphones deliver
            exceptional sound clarity and comfort.
          </p>
          <Button>See Product</Button>
        </div>
        <div className="lg:w-[550px] lg:h-[580px] md:w-[100%] md:h-[screen] sm:w-[100%] sm:h-[8vh] w-[100%] h-[320px]">
          <img src={Headphones.src} />
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}
