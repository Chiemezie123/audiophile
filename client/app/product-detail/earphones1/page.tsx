"use client";

import useScreenSize from "@/hooks/useScreenSize";
import ProductDetail from "@/features/ProductDetail";
import React from "react";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones2 from "@/assets/Headphones 2.png";
import Earphones from "@/assets/Earphones.png";
import Speakers from "@/assets/Speakers.png";
import DisplayEarphones1 from "@/assets/DisplayEarphones1.png";
import DisplayEarphones2 from "@/assets/DisplayEarphones2.png";
import DisplayEarphones3 from "@/assets/DisplayEarphones3.png";


const page = () => {
  const screen = useScreenSize();

  return (
    <div>
      <ProductDetail
        items={[
          {
            id: 1,
            image: Earphones.src,
            title: "YX1 Wireless Earphones",
            price: 599,
            width: 290,
            smallWidth: 181,
            height: 350,
            smallHeight: 201,
            isNewProduct: true,
            description:
              "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
          },
        ]}
        features_p1="Experience unrivalled stereo sound thanks to innovative acoustic technology. With improved ergonomics designed for full day wearing, these revolutionary earphones have been finely crafted to provide you with the perfect fit, delivering complete comfort all day long while enjoying exceptional noise isolation and truly immersive sound."
        features_p2="The YX1 Wireless Earphones features customizable controls for volume, music, calls, and voice assistants built into both earbuds. The new 7-hour battery life can be extended up to 28 hours with the charging case, giving you uninterrupted play time. Exquisite craftsmanship with a splash resistant design now available in an all new white and grey color scheme as well as the popular classic black."
        boxItems={[
          { quantity: "2x", item: "Earphone Unit" },
          { quantity: "6x", item: "Multi-size Earplugs" },
          { quantity: "1x", item: "User Manual" },
          { quantity: "1x", item: "USB-C Charging Cable" },
          { quantity: "1x", item: "Travel Pouch" },
        ]}
        displayImage={DisplayEarphones1.src}
        displayImage2={DisplayEarphones2.src}
        displayImage3={DisplayEarphones3.src}
        displayTitle="XX99 Mark II Headphones"
        ymalImage={Headphones3.src}
        ymalImage2={Headphones2.src}
        ymalImage3={Speakers.src}
        ymalLink="headphones3"
        ymalLink2="headphones2"
        ymalLink3="speakers1"
        ymalProductName="XX99 Mark ii"
        ymalProductName2="XX99 Mark i"
        ymalProductName3="ZX9 Speaker"
      />
    </div>
  );
};

export default page;
