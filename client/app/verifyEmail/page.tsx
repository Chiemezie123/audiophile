"use client";

import React from "react";
import LogoIcon from "@/assets/svg/logo.svg?react";
import { Button } from "@/components/ui/button";
import OtpInput from "@/components/ui/otpInput";

const page = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full py-[74.5px] pl-[104px]">
          <LogoIcon className="" fill="black" />
        </div>
        <div className="p-4 w-[543px] flex flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-semibold leading-[120%] text-gray-900">
              Verify your email
            </h3>
            <p className="text-[16px] text-gray-700">
              Enter the 6 digit code that was sent to your email below
            </p>
          </div>
          <div >
            <OtpInput />
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <Button className=" w-full rounded-[32px] capitalize text-[16px] my-6 py-9 font-semibold">
                Verify Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
