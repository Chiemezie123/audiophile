"use client";

import React from "react";
import Header from "@/features/Header";
import { Button } from "@/components/ui/button";
import useScreenSize from "@/hooks/useScreenSize";
import Image from "next/image";
import CategoryCard from "@/components/ui/CategoryCard";
import Headphones2 from "@/assets/Headphones 2.png";
import Earphones from "@/assets/Earphones.png";
import Speakers2 from "@/assets/Speakers2.png";
import ActionCard from "./ActionCard";
import Footer from "./Footer";

type CategoryProps = {
  categoryTitle: string;
  items: Array<{
    id: number;
    image: string;
    alt: string;
    smallWidth: number;
    width?: number;
    smallHeight: number;
    height?: number;
    title: string;
    description: string;
    isReversed: boolean;
    isNewProduct?: boolean;
  }>;
};

const Category = ({ categoryTitle, items }: CategoryProps) => {
  const screen = useScreenSize();
  return (
    <div>
      <section className="xs:h-[192px] lg:h-[336px] bg-[#141414]">
        <Header />
        <div className="flex justify-center items-center xs:h-[102px] lg:h-[239px]">
          <h1 className="text-white xs:h4 lg:h2 uppercase font-Bold">
            {categoryTitle}
          </h1>
        </div>
      </section>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex flex-col xs:gap-30 lg:gap-40 xs:my-16 lg:my-40">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex lg:flex-row ${
                item.isReversed ? "lg:flex-row-reverse" : ""
              } xs:flex-col items-center lg:justify-between md:justify-center h-full w-full gap-13`}
            >
              <div
                className={`bg-[#F1F1F1] flex items-center justify-center xs:p-8 lg:p-25 md:p-15 rounded-[8px] relative  w-full h-[352px] lg:w-[540px] lg:h-[560px]`}
              >
                <div className="flex flex-col justify-center gap-8 relative z-10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={screen === "large" ? item.width : item.smallWidth}
                    height={screen === "large" ? item.height : item.smallHeight}
                  />
                </div>
                <div className="absolute bottom-[81px] lg:left-[138px] rounded-[262px] blur-2xl bg-[rgba(0,0,0,0.5)] xs:w-[165px] lg:w-[262px] xs:h-[35px] lg:h-[56px] border border-red-500" />
              </div>
              <div className="md:w-[572px] lg:w-[445px] flex flex-col gap-6 lg:text-left xs:text-center md:text-center xs:items-center md:items-center lg:items-start">
                <h6 className="text-sm text-black opacity-49 tracking-[10px]">
                  {item.isNewProduct && (
                    <span className="text-sm text-[#D87D4A] tracking-[10px]">
                      NEW PRODUCT
                    </span>
                  )}
                </h6>
                <h1 className=" font-bold xs:h4 md:xs:h2 text-black uppercase">
                  {item.title}
                </h1>
                <p className="text-sm text-black opacity-50 mt-4">
                  {item.description}
                </p>
                <Button>See Product</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto xs:mt-[40px] mb-[120px] md:mt-[96.5px] lg:mt-[128px] md:mb-[96px] lg:mb-[168px] relativ">
        <div className="flex items-center relativ">
          <div className="flex xs:flex-col md:flex-row md:gap-[10px] lg:gap-[30px] text-center items-center w-full relative">
            <CategoryCard
              image={Headphones2.src}
              alt="Headphones"
              title="HEADPHONES"
              imageClassName="xs:w-[80px] xs:h-[104px] lg:w-[123px] lg:h-[160px] lg:bottom-30"
            />
            <CategoryCard
              image={Speakers2.src}
              alt="Speakers"
              title="SPEAKERS"
              imageClassName="xs:w-[84px] xs:h-[104px] lg:h-[146px] lg:w-[121px] "
            />
            <CategoryCard
              image={Earphones.src}
              alt="Earphones"
              title="EARPHONES"
              imageClassName="xs:w-[103px] xs:h-[104px] lg:h-[126px] lg:w-[123px] "
            />
          </div>
        </div>
      </section>

      <ActionCard />
      <Footer />
    </div>
  );
};

export default Category;
