"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AudioModel from "@/assets/Audio Model.png";
import HeadphonesHero from "@/assets/Headphones3.png";
import EarphonesLifestyle from "@/assets/Earphones2.png";
import InstagramColored from "@/assets/svg/InstagramColored.svg";
import { Input } from "@/components/ui/textIpnut";
import type { InputProps } from "@/components/ui/textIpnut";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";

type HelperType = { type: "link"; href?: string } | { type: "text" };

type AuthFormProps = {
  title?: string;
  description?: string;
  inputs?: InputProps[];
  buttonText?: string;
  bottomText?: string;
  linkText?: string;
  helper?: HelperType;
  hrefPath?: string | null;
  isForgotPassword?: boolean;
  isResetPassword?: boolean;
  isSubmitting?: boolean;
  hideSocialAuth?: boolean;
  hideLegalCopy?: boolean;
  hideBottomLink?: boolean;
};

const AuthForm = ({
  title,
  description,
  inputs,
  buttonText,
  bottomText,
  linkText,
  helper,
  hrefPath,
  isForgotPassword,
  isResetPassword,
  isSubmitting = false,
  hideSocialAuth = false,
  hideLegalCopy = false,
  hideBottomLink = false,
}: AuthFormProps) => {
  const slides = useMemo(
    () => [
      {
        image: AudioModel,
        eyebrow: "FuzzyBeats community",
        title: "Built around listeners who wear sound with confidence.",
        description:
          "Discover premium audio with a warmer, more human shopping experience.",
      },
      {
        image: HeadphonesHero,
        eyebrow: "Headphone essentials",
        title: "Reference-grade sound for everyday listening and deep focus.",
        description:
          "Move from browse to checkout with a cleaner path across the full catalog.",
      },
      {
        image: EarphonesLifestyle,
        eyebrow: "Portable audio",
        title: "Wireless comfort for earphones, speakers, and everything in between.",
        description:
          "A polished auth experience that feels like part of the store, not an afterthought.",
      },
    ],
    []
  );
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const isSocialAuthVisible =
    !hideSocialAuth && !isForgotPassword && !isResetPassword;
  const helperText =
    description ||
    (title === "Log In"
      ? "Access your saved cart, profile, and premium audio picks."
      : title === "Create Account" || title === "Complete Your Account"
      ? "Join FuzzyBeats to save your cart, track orders, and continue checkout."
      : "Manage your FuzzyBeats account with a cleaner, faster flow.");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfaf6_0%,#f4efe8_100%)] px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[1.6rem] border border-black/6 bg-white shadow-[0_24px_80px_rgba(16,18,25,0.1)] lg:min-h-[min(880px,calc(100vh-2rem))] lg:grid-cols-[0.88fr_1.12fr] lg:rounded-[2rem]">
        <section className="relative hidden overflow-hidden bg-[#111215] text-white lg:flex">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-all duration-700 ${
                index === activeSlide
                  ? "translate-x-0 opacity-100"
                  : "translate-x-6 opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover transition-transform duration-[1400ms] ${
                  index === activeSlide ? "scale-100" : "scale-105"
                }`}
                sizes="(max-width: 1024px) 0vw, 44vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,18,21,0.08)_0%,rgba(17,18,21,0.68)_58%,rgba(17,18,21,0.94)_100%)]" />
              <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex text-lg font-black uppercase tracking-[0.28em] text-white"
                >
                  FuzzyBeats
                </Link>
                <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/72">
                  Auth experience
                </div>
              </div>
              <div className="absolute inset-x-8 bottom-8">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f1c2a4]">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-4 max-w-md text-3xl font-black leading-[1.06] tracking-[0.02em] text-white xl:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/72 xl:text-base xl:leading-7">
                  {slide.description}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      onClick={() => setActiveSlide(dotIndex)}
                      className={`h-3 w-3 rounded-full transition ${
                        dotIndex === activeSlide
                          ? "bg-[#d87d4a]"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
          <div className="mb-6 lg:hidden">
            <Link
              href="/"
              className="inline-flex text-lg font-black uppercase tracking-[0.28em] text-[#111215]"
            >
              FuzzyBeats
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[34rem]">
            <div className="inline-flex rounded-full border border-[#d87d4a]/15 bg-[#d87d4a]/8 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d87d4a] sm:px-4 sm:text-[0.7rem]">
              Premium audio access
            </div>
            <h3 className="mt-4 text-3xl font-black leading-[1.04] text-[#24262D] sm:mt-5 sm:text-4xl lg:text-[2.8rem]">
              {title}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#5f6470] sm:text-base sm:leading-7">
              {helperText}
            </p>

            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                {inputs?.map((inputField) => (
                  <Input key={inputField.id} {...inputField} />
                ))}
                <div className="flex flex-col gap-2">
                  {helper &&
                    (helper.type === "link" ? (
                      <Link
                        href={helper.href || "#"}
                        className="text-right text-sm font-semibold text-[#d87d4a]"
                      >
                        Forgot Your Password?
                      </Link>
                    ) : (
                      <p className="text-[14px] leading-6 text-[#7a7f89]">
                        8 characters or longer. Combine upper and lowercase letters
                        and numbers.
                      </p>
                    ))}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-[32px] text-[15px] font-semibold normal-case sm:text-[16px]"
                >
                  {buttonText}
                </Button>
              </div>

              {isSocialAuthVisible ? (
                <>
                  <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa0aa] sm:my-8 sm:text-[13px] sm:tracking-[0.22em]">
                    <span className="flex-1 border-t border-[#ece7df]" />
                    or continue with
                    <span className="flex-1 border-t border-[#ece7df]" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <GoogleSignInButton className="rounded-[1rem]" />
                    {/* <button
                      type="button"
                      className="flex w-full items-center justify-center gap-4 rounded-[1rem] border-2 border-[#D7DAE0] px-4 py-3 text-[13px] font-semibold text-black transition hover:bg-[#faf7f2] sm:px-6 sm:text-[14px]"
                    >
                      <InstagramColored />
                      <span>Continue with Instagram</span>
                    </button> */}
                  </div>
                </>
              ) : null}

              <div className={`mt-6 ${isSocialAuthVisible ? "pt-4 sm:pt-6" : "pt-1"}`}>
                {!hideLegalCopy ? (
                  <div className="flex justify-center border-b border-[#f0f2f5] pb-4 sm:pb-5">
                    <div className="max-w-[360px] text-center text-[12px] leading-6 text-gray-500">
                      By continuing with Google, Instagram and Email, you agree to
                      FuzzyBeats&apos;{" "}
                      <span className="text-[#D87D4A]">
                        <a href="#">Terms of Service</a>
                      </span>{" "}
                      and{" "}
                      <span className="text-[#D87D4A]">
                        <a href="#">Privacy Policy.</a>
                      </span>
                    </div>
                  </div>
                ) : null}

                {!hideBottomLink && (bottomText || linkText) ? (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-[14px] text-[#3D434F] sm:mt-5 sm:text-[15px]">
                    {bottomText}
                    <span className="font-semibold text-[#D87D4A]">
                      <Link href={hrefPath || "#"}>{linkText}</Link>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;
