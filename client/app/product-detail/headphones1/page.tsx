import Header from "@/features/Header";
import ProductDetail from "@/features/ProductDetail";
import React from "react";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones2 from "@/assets/Headphones 2.png";
import Headphones4 from "@/assets/Headphones4.png";
import Speakers from "@/assets/Speakers.png";
import DisplayHeadphones1 from "@/assets/DisplayHeadphones1.png";
import DisplayHeadphones2 from "@/assets/DisplayHeadphones2.png";
import DisplayHeadphones3 from "@/assets/DisplayHeadphones3.png";

const page = () => {
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
            smallWidth: 300,
            height: 560,
            smallHeight: 300,
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
        displayImage3={DisplayHeadphones3.src}
        displayTitle="XX99 Mark II Headphones"
        ymalimage={Headphones2.src}
        ymalimage2={Headphones4.src}
        ymalimage3={Speakers.src}
      />
    </div>
  );
};

export default page;
