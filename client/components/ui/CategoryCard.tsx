import React from "react";
import { Button } from "./button";
import ArrowRight from "@/assets/svg/ArrowRightsvg.svg";
import Oval from "@/assets/Oval.png";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  image: string;
  alt: string;
  title: string;
  imageClassName?: string;
};

const CategoryCard = ({
  image,
  alt,
  title,
  imageClassName,
}: CategoryCardProps) => {
  return (
    <div className="w-full flex-1">
      <div className="bg-[#f1f1f1] md:h-[165px] lg:h-[204px] flex flex-col items-center mt-20 rounded-[8px] relative">
        <img
          src={image}
          alt={alt}
          className={cn(` absolute xs:bottom-26 md:bottom-29 lg:bottom-35`, imageClassName)}
        />
        <img
          src={Oval.src}
          alt="Oval"
          className="absolute xs:bottom-21 md:bottom-25 lg:bottom-31 w-[95px] h-[14px] blur-xl bg-black"
        />
        <div className="mt-22 lg:mt-29">
          <h6 className="md:text-[15px] font-bold">{title}</h6>
          <Button variant={"tertiary"} rightIcon={<ArrowRight />}>
            Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
