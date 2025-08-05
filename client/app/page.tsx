"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ArrowRight from "@/assets/svg/arrowRightsvg.svg";
import { Input } from "@/components/ui/textIpnut";
import RadioButton from "../components/ui/radioButton";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import Header from "@/features/Header";
import Footer from "@/features/Footer";
import ActionCard from "@/features/ActionCard";
import Headphones from "../assets/Headphones.png";
import Headphones2 from "../assets/Headphones 2.png";
import Earphones from "../assets/Earphones.png";
import Earphones2 from "../assets/Earphones2.png";
import Earphones2Tablet from "../assets/Earphones2Tablet.jpg";
import Speakers2 from "../assets/Speakers2.png";
import Circles from "../assets/Circles.png";
import CirclesTablet from "../assets/CirclesTablet.png";
import CirclesMobile from "../assets/CirclesMobile.png";
import Speakers3 from "../assets/Speakers3.png";
import Speakers3Tablet from "../assets/Speakers3Tablet.png";
import Speakers3Mobile from "../assets/Speakers3Mobile.png";
import CategoryCard from "@/components/ui/CategoryCard";

type ScreenSizeProps = "small" | "medium" | "large";

export default function Home() {
  const [screenSize, setScreenSize] = useState<ScreenSizeProps>("large");

  useEffect(() => {
    // const handleResize = () => {
    //   console.log("innerWidth:", window.innerWidth);
    //   if (window.innerWidth <= 768) {
    //     setScreenSize("small");
    //   } else if (window.innerWidth > 768 && window.innerWidth < 1024) {
    //     setScreenSize("medium");
    //   } else {
    //     setScreenSize("large");
    //   }
    // };
    const handleResize = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setScreenSize("small");
      } else if (
        window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches
      ) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <section className="bg-[#141414]">
        <Header />
        <div className="flex items-center lg:justify-between md:justify-center xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
          <div className="w-[395px] flex flex-col gap-6 lg:text-left xs:text-center md:text-center xs:items-center md:items-center lg:items-start">
            <h6 className="text-sm text-white opacity-49 tracking-[10px]">
              NEW PRODUCT
            </h6>
            <h1 className="h1 font-bold xs:text-4xl text-white uppercase">
              XX99 Mark II Headphones
            </h1>
            <p className="text-sm text-white opacity-50 mt-4">
              Experience the ultimate in audio quality with the XX99 Mark II
              Headphones. Designed for audiophiles, these headphones deliver
              exceptional sound clarity and comfort.
            </p>
            <Button>See Product</Button>
          </div>
          <div className="lg:w-[550px] lg:h-[580px] xs:hidden lg:block">
            <img src={Headphones.src} />
          </div>
        </div>
      </section>

      <section className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="md:h-[400px] flex items-center">
          <div className="flex xs:flex-col md:flex-row md:gap-[10px] lg:gap-[25px] text-center items-center">
            {/* <div className="bg-[#f1f1f1] h-[204px] w-[327px] md:w-[223px] lg:w-[350px] flex flex-col items-center gap-2 mt-20 rounded-[8px] relative">
              <img
                src={Headphones2.src}
                alt="Headphones"
                className="w-[123px] h-[160px] absolute bottom-30"
              />
              <div className="mt-25">
                <h6 className="font-bold">HEADPHONES</h6>
                <Button variant={"tertiary"}>Shop</Button>
              </div>
            </div> */}
            <CategoryCard
              image={Headphones2.src}
              alt="Headphones"
              title="HEADPHONES"
            />
            <CategoryCard
              image={Speakers2.src}
              alt="Speakers"
              title="SPEAKERS"
            />
            <CategoryCard
              image={Earphones.src}
              alt="Earphones"
              title="EARPHONES"
            />
          </div>
        </div>
      </section>

      <section className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex flex-col gap-8 mt-18">
          <img
            src={
              screenSize === "small"
                ? CirclesMobile.src
                : screenSize === "medium"
                ? CirclesTablet.src
                : Circles.src
            }
            alt="Circles"
            className="absolute"
          />
          <div className="xs:h-[600px] md:h-[720px] lg:h-[560px] bg-[#D87D4A] flex xs:flex-col lg:flex-row items-center justify-center lg:gap-30 xs:gap-18 px-8 rounded-[8px]">
            <img
              src={Speakers2.src}
              alt="Speakers"
              className="rounded-[8px] lg:mt-17 lg:w-[410px] lg:h-[493px] xs:w-[197px] xs:h-[237px] z-10"
            />
            <div className="flex flex-col justify-center lg:items-start xs:items-center lg:text-left xs:text-center lg:gap-8 xs:gap-6 md:w-[339px] w-[280px]">
              <h2 className="h1  text-white font-bold">
                ZX9 SPEAKER
              </h2>
              <p className="text-sm text-white opacity-75">
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound.
              </p>
              <Button variant={"quaternary"} className="mt-4 z-1">
                See Product
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col justify-center xs:gap-4 md:gap-8 absolute top-[30%] xs:left-6 lg:left-25 md:left-15.5">
              <h2 className="h4 font-bold">ZX7 SPEAKER</h2>
              <Button variant={"secondary"} className="mt-4">
                See Product
              </Button>
            </div>
            <img
              src={
                screenSize === "small"
                  ? Speakers3Mobile.src
                  : screenSize === "medium"
                  ? Speakers3Tablet.src
                  : Speakers3.src
              }
              className={"rounded-[8px]"}
            />
          </div>
          <div className="flex xs:flex-col md:flex-row gap-[30px]">
            <div className=" lg:w-[540px] md:w-[339px] rounded-[8px]">
              <img
                src={
                  screenSize === "medium"
                    ? Earphones2Tablet.src
                    : Earphones2.src
                }
                alt="Earphones"
                className="rounded-[8px] xs:h-[200px] md:h-[320px]"
              />
            </div>
            <div className="bg-[#F1F1F1] lg:w-[540px] md:w-[339px] xs:h-[200px] md:h-[320px] flex items-center xs:p-8 lg:p-25 md:p-15 rounded-[8px]">
              <div className="flex flex-col justify-center gap-8">
                <h3 className="h4 font-bold">YX1 EARPHONES</h3>
                <Button variant={"secondary"}>See Product</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ActionCard screenSize={screenSize} />
      <Footer />
    </div>
  );
}
