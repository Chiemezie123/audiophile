import React from "react";
import Category from "@/features/category";
import Earphones from "@/assets/Earphones.png";

const page = () => {
  return (
    <div>
      <Category
        categoryTitle="Earphones"
        items={[
          {
            id: 1,
            isNewProduct: true,
            image: Earphones.src,
            alt: "YX1 WIRELESS EARPHONES",
            title: "YX1 WIRELESS EARPHONES",
            description:
              "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
            isReversed: true,
            smallWidth: 200,
            width: 350,
            smallHeight: 200,
            height: 386
          },
        ]}
      />
    </div>
  );
};

export default page;
