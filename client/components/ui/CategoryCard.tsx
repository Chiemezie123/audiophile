import React from "react";
import { Button } from "./button";


type CategoryCardProps = {
  image: string;
  alt: string;
  title: string;
};

const CategoryCard = ({ image, alt, title }: CategoryCardProps) => {
  return (
    <div>
      <div className="bg-[#f1f1f1] h-[204px] w-[327px] md:w-[223px] lg:w-[350px] flex flex-col items-center gap-2 mt-20 rounded-[8px] relative">
        <img
          src={image}
          alt={alt}
          className="w-[123px] h-[160px] absolute bottom-30"
        />
        <div className="mt-25">
          <h6 className="font-bold">{title}</h6>
          <Button variant={"tertiary"}>Shop</Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
