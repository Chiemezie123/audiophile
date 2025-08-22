import React from "react";
import Category from "@/features/category";
import Speakers from "@/assets/Speakers.png";
import Speakers4 from "@/assets/Speakers4.png";

const page = () => {
  return (
    <div>
      <Category
        categoryTitle="Speakers"
        items={[
          {
            id: 1,
            isNewProduct: true,
            image: Speakers.src,
            alt: "ZX9 SPEAKER",
            title: "ZX9 SPEAKER",
            description:
              "Upgrade your sound system with the all new ZX9 active speaker. It's a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.",
            isReversed: true,
            smallWidth: 202,
            width: 291,
            smallHeight: 243,
            height: 350
          },
          {
            id: 2,
            image: Speakers4.src,
            alt: "ZX7 SPEAKER",
            title: "ZX7 SPEAKER",
            description:
              "Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.",
            isReversed: false,
            smallWidth: 169,
            width: 268,
            smallHeight: 243,
            height: 385
          },
        ]}
      />
    </div>
  );
};

export default page;
