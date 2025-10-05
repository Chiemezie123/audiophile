"use client";

import ProductDetail from "@/features/ProductDetail";
import React from "react";
import Headphones2 from "@/assets/Headphones 2.png";
import Headphones4 from "@/assets/Headphones4.png";
import Speakers from "@/assets/Speakers.png";
import Speakers2 from "@/assets/Speakers4.png";
import DisplaySpeakers1 from "@/assets/DisplaySpeakers1.png";
import DisplaySpeakers2 from "@/assets/DisplaySpeakers2.png";
import DisplaySpeakers3 from "@/assets/DisplaySpeakers3.png";

const page = () => {
  return (
    <div>
      <ProductDetail
        items={[
          {
            id: 1,
            image: Speakers.src,
            title: "ZX9 Speakers",
            price: 4500,
            width: 291,
            smallWidth: 181,
            height: 350,
            smallHeight: 201,
            isNewProduct: true,
            description:
              "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.",
          },
        ]}
        features_p1="Connect via Bluetooth or nearly any wired source. This speaker features optical, digital coaxial, USB Type-B, stereo RCA, and stereo XLR inputs, allowing you to have up to five wired source devices connected for easy switching. Improved bluetooth technology offers near lossless audio quality at up to 328ft (100m)."
        features_p2="Discover clear, more natural sounding highs than the competition with ZX9's signature planar diaphragm tweeter. Equally important is its powerful room-shaking bass courtesy of a 6.5” aluminum alloy bass unit. You'll be able to enjoy equal sound quality whether in a large room or small den. Furthermore, you will experience new sensations from old songs since it can respond to even the subtle waveforms."
        boxItems={[
          { quantity: "1x", item: "Headphone Unit" },
          { quantity: "2x", item: "Replacement Earcups" },
          { quantity: "1x", item: "User Manual" },
          { quantity: "1x", item: "3.5mm 5m Audio Cable" },
          { quantity: "1x", item: "Travel Bag" },
        ]}
        displayImage={DisplaySpeakers1.src}
        displayImage2={DisplaySpeakers2.src}
        displayImage3={DisplaySpeakers3.src}
        displayTitle="ZX9 Speaker"
        ymalImage={Speakers2.src}
        ymalImage2={Headphones2.src}
        ymalImage3={Headphones4.src}
        ymalLink="speaker2"
        ymalLink2="headphones2"
        ymalLink3="headphones4"
        ymalProductName="ZX7 Speaker"
        ymalProductName2="XX99 Mark i"
        ymalProductName3="XX59"
      />
    </div>
  );
};

export default page;
