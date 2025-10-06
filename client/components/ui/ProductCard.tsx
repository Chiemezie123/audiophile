import Image from "next/image";
import React from "react";
import { Button } from "./button";
import useScreenSize from "@/hooks/useScreenSize";
import Link from "next/link";

type ProductCardProps = {
  ymalImage: string,
  ymalProductName: string;
  ymalLink: string;
};

const ProductCard = ({ ymalImage, ymalProductName, ymalLink }: ProductCardProps) => {

  const screen = useScreenSize();

  return (
    <div className="flex flex-col gap-10">
        <div
          className="bg-[#F1F1F1] flex items-center justify-center xs:p8 lg:p-25 rounded-[8px] w-full xs:h-[120px] md:h-[318px] lg:h-[318px]"
        >
          <Image
            src={ymalImage}
            alt={ymalLink}
            width={screen==="small" ? 75 : 350}
            height={screen === "small" ? 90 :318}
          />
        </div>
      <div className="flex flex-col items-center justify-center gap-8">
      <div className="h5 font-Bold uppercase">{ymalProductName}</div>
      <Link href={`/product-detail/${ymalLink}`}>
      <Button>See Product</Button>
      </Link>
      </div>
    </div>
  );
};

export default ProductCard;
