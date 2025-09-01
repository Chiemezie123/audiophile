"use client";

import { Button } from "@/components/ui/button";
import Header from "@/features/Header";
import Image from "next/image";
import React from "react";
import useScreenSize from "@/hooks/useScreenSize";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import CategoryCard from "@/components/ui/CategoryCard";
import Headphones2 from "@/assets/Headphones 2.png";
import Earphones from "@/assets/Earphones.png";
import Speakers2 from "@/assets/Speakers2.png";
import ActionCard from "./ActionCard";
import Footer from "./Footer";
import ProductCard from "@/components/ui/ProductCard";

type ProductDetailProps = {
  items: Array<{
    id: number;
    image: string;
    title: string;
    price: number;
    width: number;
    smallWidth: number;
    height: number;
    smallHeight: number;
    isNewProduct: boolean;
    description: string;
  }>;
  boxItems: Array<{
    quantity: string;
    item: string;
  }>;
  displayImage: string;
  displayImage2: string;
  displayImage3: string;
  displayTitle: string;
  ymalimage: string;
  ymalimage2: string;
  ymalimage3: string;
};

const ProductDetail = ({
  items,
  boxItems,
  displayImage,
  displayImage2,
  displayImage3,
  displayTitle,
  ymalimage,
  ymalimage2,
  ymalimage3,
}: ProductDetailProps) => {
  const screen = useScreenSize();

  return (
    <div>
      <Header />
      <button>Go Back</button>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex flex-col xs:gap-30 lg:gap-40 xs:my-16 lg:my-40">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex lg:flex-row  "lg:flex-row-reverse" : ""
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
              <div className="md:w-[572px] lg:w-[445px] flex flex-col gap-8 lg:text-left xs:text-center md:text-center xs:items-center md:items-center lg:items-start">
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
                <p className="h6 font-Bold">$ {item.price}</p>
                <div className="flex gap-4">
                  <SizeInputHandler />
                  <Button>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex gap-[125px]">
          <div className="lg:w-[635px] flex flex-col gap-8">
            <h1 className="h3 font-Bold uppercase">Features</h1>
            <p className="text-[15px] opacity-50">
              Featuring a genuine leather head strap and premium earcups, these
              headphones deliver superior comfort for those who like to enjoy
              endless listening. It includes intuitive controls designed for any
              situation. Whether you're taking a business call or just in your
              own personal space, the auto on/off and pause features ensure that
              you'll never miss a beat.
            </p>
            <p className="text-[15px] opacity-50">
              The advanced Active Noise Cancellation with built-in equalizer
              allow you to experience your audio world on your terms. It lets
              you enjoy your audio in peace, but quickly interact with your
              surroundings when you need to. Combined with Bluetooth 5. 0
              compliant connectivity and 17 hour battery life, the XX99 Mark II
              headphones gives you superior sound, cutting-edge technology, and
              a modern design aesthetic.
            </p>
          </div>
          <div className="lg:w-[350px] flex flex-col gap-8">
            <h1 className="h3 font-Bold uppercase">In the Box</h1>
            <ul className="text-[15px] opacity-50 gap-2">
              {boxItems.map((boxItem, index) => (
                <li key={index} className="flex gap-6 leading-[25px]">
                  <span className="text-[#D87D4A] font-Bold">
                    {boxItem.quantity}
                  </span>
                  <span>{boxItem.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex gap-8 my-40">
          <div className="flex flex-col gap-8">
            <Image
              src={displayImage}
              alt={displayTitle}
              width={445}
              height={280}
              className="rounded-md"
            />
            <Image
              src={displayImage2}
              alt={displayTitle}
              width={445}
              height={280}
              className="rounded-md"
            />
          </div>
          <div>
            <Image
              src={displayImage3}
              alt={displayTitle}
              width={635}
              height={592}
              className="rounded-md"
            />
          </div>
        </div>
      </section>

      <section>
        <h1>You may also Like</h1>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-7.5">
          <ProductCard ymalimage={ymalimage} />
          <ProductCard ymalimage={ymalimage2} />
          <ProductCard ymalimage={ymalimage3} />
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

export default ProductDetail;
