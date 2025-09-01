import Image from "next/image";
import React from "react";
import Headphones from "@/assets/Headphones 2.png";

type ProductCardProps = {
  ymalimage: string;
};

const ProductCard = ({ ymalimage }: ProductCardProps) => {
  return (
    <div>
      <div>
        <div
          className="bg-[#F1F1F1] flex items-center justify-center xs:p-8 lg:p-25 md:p-15 rounded-[8px] w-full h-[352px] lg:w-[350px] lg:h-[318px]"
        >
          <Image
            src={ymalimage}
            alt="Product Image"
            width={350}
            height={318}
          />
        </div>
      </div>
      <div>Name</div>
      <div>button</div>
    </div>
  );
};

export default ProductCard;
