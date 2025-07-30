import React from "react";
import audiomodel from "../assets/Audio Model.png";

const ActionCard = () => {
  return (
    <div className="flex items-center justify-between gap-[125px] mt-18">
      <div className="text-white flex flex-col gap-8">
        <h2 className="h2 text-[var(--color-white)] uppercase">
          Bringing you the <br />{" "}
          <span className="text-[var(--color-warm-orange-brown)]">best</span>{" "}
          audio gear
        </h2>
        <p className=" w-[445px] text-sm">
          Located at the heart of New York City, Audiophile is the premier store
          for high end headphones, earphones, speakers, and audio accessories.
          We have a large showroom and luxury demonstration rooms available for
          you to browse and experience a wide range of our products. Stop by our
          store to meet some of the fantastic people who make Audiophile the
          best place to buy your portable audio equipment.
        </p>
      </div>
      <div>
        <img
          src={audiomodel.src}
          alt="Audio Model"
          className="w-[540px] h-[588px]"
        />
      </div>
    </div>
  );
};

export default ActionCard;
