"use client";

import Header from "@/features/Header";
import useScreenSize from "@/hooks/useScreenSize";
import ProductDetail from "@/features/ProductDetail";
import React from "react";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones2 from "@/assets/Headphones 2.png";
import Headphones4 from "@/assets/Headphones4.png";
import Speakers from "@/assets/Speakers.png";
import DisplayHeadphones1 from "@/assets/DisplayHeadphones1.png";
import DisplayHeadphones2 from "@/assets/DisplayHeadphones2.png";
import DisplayHeadphones3 from "@/assets/DisplayHeadphones3.png";
import DisplayHeadphones3Tablet from "@/assets/DisplayHeadphones3Tablet.png";
import DisplayHeadphones3Mobile from "@/assets/DisplayHeadphones3Mobile.png";

const page = () => {
  const screen = useScreenSize();

  return (
    <div>
      <ProductDetail
        items={[
          {
            id: 1,
            image: Headphones3.src,
            title: "XX99 Mark II Headphones",
            price: 2999,
            width: 540,
            smallWidth: 181,
            height: 560,
            smallHeight: 201,
            isNewProduct: true,
            description:
              "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
          },
        ]}
        boxItems={[
          { quantity: "1x", item: "Headphone Unit" },
          { quantity: "2x", item: "Replacement Earcups" },
          { quantity: "1x", item: "User Manual" },
          { quantity: "1x", item: "3.5mm 5m Audio Cable" },
          { quantity: "1x", item: "Travel Bag" },
        ]}
        displayImage={DisplayHeadphones1.src}
        displayImage2={DisplayHeadphones2.src}
        displayImage3={
          screen === "large"
            ? DisplayHeadphones3.src
            : screen === "medium"
            ? DisplayHeadphones3Tablet.src
            : DisplayHeadphones3Mobile.src
        }
        displayTitle="XX99 Mark II Headphones"
        ymalImage={Headphones2.src}
        ymalImage2={Headphones4.src}
        ymalImage3={Speakers.src}
        ymalProductName="XX99 Mark i"
        ymalProductName2="XX59"
        ymalProductName3="ZX9 Speaker"
      />
    </div>
  );
};

export default page;
