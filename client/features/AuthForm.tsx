import React from "react";
import LogoIcon from "@/assets/svg/Logo.svg?react";
import GoogleIcon from "@/assets/svg/Google.svg?react";
import InstagramColored from "@/assets/svg/InstagramColored.svg?react";
import { Input } from "@/components/ui/textIpnut";
import type { InputProps } from "@/components/ui/textIpnut";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type HelperType = { type: "link"; href?: string } | { type: "text" };

type AuthFormProps = {
  title: string;
  inputs: InputProps[];
  buttonText: string;
  bottomText: string;
  linkText: string;
  helper?: HelperType;
  hrefPath: string;
  isForgotPassword?: boolean;
  isResetPassword?: boolean;
};

const AuthForm = ({
  title,
  inputs,
  buttonText,
  bottomText,
  linkText,
  helper,
  hrefPath,
  isForgotPassword,
  isResetPassword,
}: AuthFormProps) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full py-[74.5px] pl-[104px]">
        <LogoIcon className="" fill="black" />
      </div>
      <div className="p-4 w-[543px] flex flex-col gap-[22px]">
        <h3 className="text-3xl font-semibold leading-[120%] text-[#24262D]">
          {title}
        </h3>
        <div>
          <div className="flex flex-col gap-4">
            {inputs.map((inputField) => (
              <Input key={inputField.id} {...inputField} />
            ))}
            <div className="flex flex-col gap-2">
              {helper &&
                (helper.type === "link" ? (
                  <Link
                    href={helper.href}
                    className="text-right text-[#D87D4A]"
                  >
                    Forgot Your Password?
                  </Link>
                ) : (
                  <p className="text-[14px] text-gray-400">
                    8 characters or longer. Combine upper and lowercase letters
                    and numbers.
                  </p>
                ))}
            </div>
            <Button className=" w-full rounded-[32px] capitalize text-[16px] font-semibold">
              {buttonText}
            </Button>
          </div>

          {!isForgotPassword && !isResetPassword && (
            <div className="flex items-center gap-2 text-gray-700 text-[14px] my-6">
              <span className="flex-1 border-t border-gray-100"></span>
              OR
              <span className="flex-1 border-t border-gray-100"></span>
            </div>
          )}
          <div className="flex flex-col items-center gap-4 text-[14px] text-black font-semibold">
            {!isForgotPassword && !isResetPassword && (
              <div className="flex flex-col gap-4 w-full">
                <div className="border-2 border-[#D7DAE0] py-3 px-16 w-full rounded-[32px] flex items-center self-stretch justify-center gap-4">
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </div>
                <div className="border-2 border-[#D7DAE0] py-3 px-16 w-full rounded-[32px] flex items-center self-stretch justify-center gap-4">
                  <InstagramColored />
                  <span>Continue with Instagram</span>
                </div>
              </div>
            )}
            <div className={`w-full flex justify-center border-b-1 border-[#f0f2f5] pb-4 ${isForgotPassword || isResetPassword ? "mt-6" : ""}`}>
              <div className="max-w-[360px] text-center text-[12px] text-gray-500 ">
                By continuing with Google, Instagram and Email, you agree to
                Virality's{" "}
                <span className="text-[#D87D4A]">
                  <a href="#">Terms of Service</a>
                </span>{" "}
                and{" "}
                <span className="text-[#D87D4A]">
                  <a href="#">Privacy Policy.</a>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[11px] text-[16px] text-[#3D434F]">
              {bottomText}
              <span className="text-[#D87D4A] font-semibold text-sm">
                <Link href={hrefPath}>{linkText}</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
