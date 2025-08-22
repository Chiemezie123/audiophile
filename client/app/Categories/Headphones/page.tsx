"use client";

import React from "react";
import Category from "@/features/category";
import Headphones2 from "@/assets/Headphones 2.png";
import Headphones3 from "@/assets/Headphones3.png";
import Headphones4 from "@/assets/Headphones4.png";

const page = () => {
  return (
    <div>
      <Category
        categoryTitle="Headphones"
        items={[
          {
            id: 1,
            isNewProduct: true,
            image: Headphones3.src,
            alt: "XX99 Mark II Headphones",
            title: "XX99 Mark II Headphones",
            description:
              "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
            isReversed: true,
            smallWidth: 220,
            width: 350,
            smallHeight: 243,
            height: 386
          },
          {
            id: 2,
            image: Headphones2.src,
            alt: "XX99 Mark I Headphones",
            title: "XX99 Mark I Headphones",
            description:
              "As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music aficionados alike in studios and on the go.",
            isReversed: false,
            smallWidth: 173,
            width: 295,
            smallHeight: 225,
            height: 385
          },
          {
            id: 3,
            image: Headphones4.src,
            alt: "XX59 Headphones",
            title: "XX59 Headphones",
            description:
              "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.",
            isReversed: true,
            smallWidth: 216,
            width: 373,
            smallHeight: 225,
            height: 389
          },
        ]}
      />
    </div>
  );
};

export default page;
