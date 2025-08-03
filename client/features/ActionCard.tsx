import React from "react";
import audiomodel from "../assets/Audio Model.png";
import audiomodeltablet from "../assets/AudioModelTablet.png";
import audiomodelmobile from "../assets/AudioModelMobile.png";

type ActionCardProps = {
  screenSize: "small" | "medium" | "large";
};

const ActionCard = ({ screenSize }: ActionCardProps) => {
  return (
    <div>
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto">
        <div className="flex lg:flex-row xs:flex-col-reverse items-center justify-between xs:gap-10 lg:gap-[125px] md:gap-[63px] xs:my-24 lg:my-50">
          <div className="text-white xs:text-center lg:text-left flex flex-col gap-8 md:w-[573px] lg:w-[445px]">
            <h2 className="h2 text-[28px] font-Bold text-black uppercase">
              Bringing you the{" "}
              <span className="text-warm-orange-brown">best</span> audio gear
            </h2>
            <p className="text-sm text-black opacity-50">
              Located at the heart of New York City, Audiophile is the premier
              store for high end headphones, earphones, speakers, and audio
              accessories. We have a large showroom and luxury demonstration
              rooms available for you to browse and experience a wide range of
              our products. Stop by our store to meet some of the fantastic
              people who make Audiophile the best place to buy your portable
              audio equipment.
            </p>
          </div>
          <div>
            <img
              src={
                screenSize === "small"
                  ? audiomodelmobile.src
                  : screenSize === "medium"
                  ? audiomodeltablet.src
                  : audiomodel.src
              }
              className="rounded-[8px] lg:w-[540px] lg:h-[588px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
