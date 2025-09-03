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
  ymalImage: string;
  ymalImage2: string;
  ymalImage3: string;
  ymalLink: string;
  ymalLink2: string;
  ymalLink3: string;
  ymalProductName: string;
  ymalProductName2: string;
  ymalProductName3: string;
  features_p1: string;
  features_p2: string;
};

const ProductDetail = ({
  items,
  boxItems,
  displayImage,
  displayImage2,
  displayImage3,
  displayTitle,
  ymalImage,
  ymalImage2,
  ymalImage3,
  ymalLink,
  ymalLink2,
  ymalLink3,
  ymalProductName,
  ymalProductName2,
  ymalProductName3,
  features_p1,
  features_p2,
}: ProductDetailProps) => {
  const screen = useScreenSize();

  return (
    <div>
      <Header />
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto md:mt-[33px] xs:mt-4 xs:mb-6 lg:mt-20 lg:mb-14">
        <button className="text-sm opacity-50">Go Back</button>
      </div>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex flex-col xs:gap-30 lg:gap-40 xs:mb-16 lg:mb-40">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex md:flex-row xs:flex-col items-center lg:justify-between md:justify-cente h-full w-full gap-13"
            >
              <div className="bg-[#F1F1F1] flex items-center justify-center xs:p-8 lg:p-25 rounded-[8px] relative  xs:w-full md:w-[281px] md:h-[480px] xs:h-[352px] lg:w-[540px] lg:h-[560px]">
                <div className="flex flex-col justify-center gap-8 relative z-10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={screen === "large" ? item.width : item.smallWidth}
                    height={screen === "large" ? item.height : item.smallHeight}
                  />
                </div>
                <div className="absolute bottom-[81px] lg:left-[138px] rounded-[262px] blur-2xl bg-[rgba(0,0,0,0.5)] xs:w-[136px] lg:w-[262px] xs:h-[29px] lg:h-[56px]" />
              </div>
              <div className="md:w-[340px] lg:w-[445px] flex flex-col gap-8 lg:text-left xs:text-cente md:text-cente xs:items-cente md:items-cente lg:items-start">
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
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex xs:flex-col lg:flex-row gap-[125px]">
          <div className="xs:w-full lg:w-[635px] flex flex-col gap-8">
            <h1 className="h3 font-Bold uppercase">Features</h1>
            <p className="text-[15px] opacity-50">{features_p1}</p>
            <p className="text-[15px] opacity-50">{features_p2}</p>
          </div>
          <div className="lg:w-[350px] flex xs:flex-col md:flex-row lg:flex-col xs:gap-6 lg:gap-8">
            <h1 className="h3 font-Bold uppercase w-[339px]">In the Box</h1>
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
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex xs:flex-col md:flex-row xs:gap-5 lg:gap-8 my-40">
          <div className="flex flex-col xs:gap-5 lg:gap-8">
            <Image
              src={displayImage}
              alt={displayTitle}
              width={screen === "large" ? 445 : screen === "medium" ? 277 : 327}
              height={screen === "large" ? 280 : 174}
              className="rounded-md"
            />
            <Image
              src={displayImage2}
              alt={displayTitle}
              width={screen === "large" ? 445 : screen === "medium" ? 277 : 327}
              height={screen === "large" ? 280 : 174}
              className="rounded-md"
            />
          </div>
          <div>
            <Image
              src={displayImage3}
              alt={displayTitle}
              width={screen === "large" ? 635 : screen === "medium" ? 395 : 327}
              height={
                screen === "large" ? 592 : screen === "medium" ? 368 : 240
              }
              className="rounded-md"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] w-full mx-auto flex flex-col gap-16">
          <h1 className="text-center h3 font-Bold uppercase">
            You may also Like
          </h1>
          <div className="flex flex-col md:flex-row gap-14 md:gap-[11px] lg:gap-7.5">
            <ProductCard
              ymalImage={ymalImage}
              ymalProductName={ymalProductName}
              ymalLink={ymalLink}
            />
            <ProductCard
              ymalImage={ymalImage2}
              ymalProductName={ymalProductName2}
              ymalLink={ymalLink2}
            />
            <ProductCard
              ymalImage={ymalImage3}
              ymalProductName={ymalProductName3}
              ymalLink={ymalLink3}
            />
          </div>
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
