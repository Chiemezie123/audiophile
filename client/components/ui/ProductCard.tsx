import Image from "next/image";
import React from "react";
import { Button } from "./button";
import useScreenSize from "@/hooks/useScreenSize";

type ProductCardProps = {
  ymalImage: string,
  ymalProductName: string;
};

const ProductCard = ({ ymalImage, ymalProductName }: ProductCardProps) => {
  
  const screen = useScreenSize();

  return (
    <div className="flex flex-col gap-10">
        <div
          className="bg-[#F1F1F1] flex items-center justify-center xs:p8 lg:p-25 rounded-[8px] w-full xs:h-[120px] md:h-[318px] lg:h-[318px]"
        >
          <Image
            src={ymalImage}
            alt="Product Image"
            width={screen==="small" ? 75 : 350}
            height={screen === "small" ? 90 :318}
          />
        </div>
      <div className="flex flex-col items-center justify-center gap-8">
      <div className="h5 font-Bold uppercase">{ymalProductName}</div>
      <Button>See Product</Button>
      </div>
    </div>
  );
};

export default ProductCard;
