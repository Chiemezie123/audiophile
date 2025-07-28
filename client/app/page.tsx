"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ArrowRight from "@/assets/svg/arrowRightsvg.svg";
import { Input } from "@/components/ui/textIpnut";
import RadioButton from "../components/ui/radioButton";
import SizeInputHandler from "@/components/ui/sizeInputHandler";

export default function Home() {
  const [isActive, setIsActive] = useState("e-money");
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-4">
        <p className="h1 font-Bold text-black uppercase">AudioPhile</p>

        <p className="h6 text-black opacity-50 max-w-[500px]">
          Located at the heart of New York City, Audiophile is the premier store
          for high end headphones, earphones, speakers, and audio accessories.
          We have a large showroom and luxury demonstration rooms available for
          you to browse and experience a wide range of our products. Stop by our
          store to meet some of the fantastic people who make Audiophile the
          best place to buy your portable audio equipment.
        </p>

        <Button>See Product</Button>
        <Button variant={"secondary"}>See Product</Button>
        <Button variant={"tertiary"} rightIcon={<ArrowRight />}>
          SHOP
        </Button>

        <Input placeholder={"Insert your name"} label={"Name"} />
      </div>
      <div className="flex flex-col gap-16">
        <RadioButton
          label={"e-money"}
          value={"e-money"}
          isActive={isActive === "e-money"}
          onClick={() => setIsActive("e-money")}
        />

        <SizeInputHandler />
      </div>
    </div>
  );
}
