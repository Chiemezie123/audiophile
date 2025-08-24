import { Button } from "@/components/ui/button";
import  useScreenSize  from "@/hooks/useScreenSize"
import ArrowRight from "@/assets/svg/arrowRightsvg.svg";
import { Input } from "@/components/ui/textIpnut";
import RadioButton from "../components/ui/radioButton";
import SizeInputHandler from "@/components/ui/sizeInputHandler";
import Header from "@/features/Header";
import Footer from "@/features/Footer";
import ActionCard from "@/features/ActionCard";
import Headphones from "../assets/Headphones.png";
import HeadphonesMobile from "../assets/HeadphonesMobile.png";
import HeadphonesTablet from "../assets/HeadphonesTablet.png";
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
import Image from "next/image";

export default function Home() {

  const screen = useScreenSize();

  return (
    <div>
      <section className="bg-[#141414] relative">
        <div className="absolute top-0 w-full z-10">
          <Header />
        </div>
        <div className="xs:max-w-[327px] md:max-w-full lg:max-w-[1110px] w-full mx-auto relative h-[600px] md:h-[768px] lg:h-[729px] overflow-hidden">
          <div className="flex items-center lg:justify-between md:justify-center h-full w-full relative">
            <div className="w-[395px] flex flex-col gap-6 lg:text-left xs:text-center md:text-center xs:items-center md:items-center lg:items-start relative z-10">
              <h6 className="text-sm text-white opacity-49 tracking-[10px]">
                NEW PRODUCT
              </h6>
              <h1 className=" font-bold xs:text-xs lg:text-h1 text-white uppercase">
                XX99 Mark II Headphones
              </h1>
              <p className="text-sm text-white opacity-50 mt-4">
                Experience the ultimate in audio quality with the XX99 Mark II
                Headphones. Designed for audiophiles, these headphones deliver
                exceptional sound clarity and comfort.
              </p>
              <Button>See Product</Button>
            </div>
          </div>
          <div className="absolute inset-0 lg:inset-none md:w-full h-full lg:w-[708px] lg:top-0 lg:left-[400px]">
            <Image
              src={
                screen === "small"
                  ? HeadphonesMobile.src
                  : screen === "medium"
                  ? HeadphonesTablet.src
                  : Headphones.src
              }
              alt="XX99 Mark II Headphones"
              className="w-full h-full object-contain"
              fill
            />
          </div>
        </div>
      </section>

      <section className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto xs:mt-[40px] mb-[120px] md:mt-[96.5px] lg:mt-[128px] md:mb-[96px] lg:mb-[168px]">
        <div className="flex items-center">
          <div className="flex xs:flex-col md:flex-row md:gap-[10px] lg:gap-[30px] text-center items-center w-full">
            <CategoryCard
              image={Headphones2.src}
              alt="Headphones"
              title="HEADPHONES"
              imageClassName="xs:w-[80px] xs:h-[104px] lg:w-[123px] lg:h-[160px]  lg:bottom-30"
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

      <section className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex flex-col gap-8 mt-18">
          <Image
            src={
              screen === "small"
                ? CirclesMobile.src
                : screen === "medium"
                ? CirclesTablet.src
                : Circles.src
            }
            alt="Circles"
            className="absolute"
            height={screen === "small" ? 588 : 944}
            width={screen === "small" ? 327 : 944}
          />
          <div className="xs:h-[600px] md:h-[720px] lg:h-[560px] bg-[#D87D4A] flex xs:flex-col lg:flex-row items-center justify-center lg:gap-30 xs:gap-18 px-8 rounded-[8px]">
            <Image
              src={Speakers2.src}
              alt="Speakers"
              className="rounded-[8px] lg:mt-17 lg:w-[410px] lg:h-[493px] xs:w-[197px] xs:h-[237px] z-10"
              width={screen === "large" ? 410 : 197}
              height={screen === "large" ? 493 : 237}
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
            <Image
              src={
                screen === "small"
                  ? Speakers3Mobile.src
                  : screen === "medium"
                  ? Speakers3Tablet.src
                  : Speakers3.src
              }
              className={"rounded-[8px]"}
              alt="Speakers"
              width={
                screen === "small"
                  ? 327
                  : screen === "medium"
                  ? 689
                  : 1110
              }
              height={320}
            />
          </div>
          <div className="flex xs:flex-col md:flex-row gap-[30px]">
            <div className=" lg:w-[540px] md:w-[339px] rounded-[8px]">
              <Image
                src={
                  screen === "medium"
                    ? Earphones2Tablet.src
                    : Earphones2.src
                }
                alt="Earphones"
                className="rounded-[8px] xs:h-[200px] md:h-[320px]"
                width={screen === "medium" ? 689 : 540}
                height={screen === "small" ? 200 : 320}
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

      <ActionCard />
      <Footer />
    </div>
  );
}
