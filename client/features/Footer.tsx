import React from "react";
import Header from "./Header";
import FacebookIcon from "@/assets/svg/Facebook.svg?react";
import TwitterIcon from "@/assets/svg/Twitter.svg?react";
import InstagramIcon from "@/assets/svg/Instagram.svg?react";
import LogoIcon from "@/assets/svg/Logo.svg?react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#141414] py-6 lg:py-10">
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto px-4">
        <div className="flex xs:flex-col lg:flex-row xs:items-center md:items-start gap-12 lg:justify-between z-1 py-8">
          <div className=" flex items-center gap-10">
            <LogoIcon fill="white"/>
          </div>
          <ul className="flex xs:flex-col md:flex-row lg:inline-flex text-center gap-4 lg:gap-8.5 pr-0.5 justify-center md:items-start text-xs uppercase text-white ">
            <Link href="/" passHref>
              <li className="cursor-pointer hover:text-warm-orange-brown font-bold">
                Home
              </li>
            </Link>
            <Link href="/Categories/Headphones" passHref>
              <li className="cursor-pointer hover:text-warm-orange-brown font-bold">
                Headphones
              </li>
            </Link>
            <Link href="/Categories/Speakers" passHref>
              <li className="cursor-pointer hover:text-warm-orange-brown font-bold">
                Speakers
              </li>
            </Link>
            <Link href="/Categories/Earphones" passHref>
              <li className="cursor-pointer hover:text-warm-orange-brown font-bold">
                Earphones
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex xs:flex-col md:flex-row justify-between xs:items-center md:items-start mt-10">
          <p className="xs:w-[327px] md:w-[540px] text-sm text-white xs:text-center md:text-justify opacity-50">
            Audiophile is an all in one stop to fulfill your audio needs. We're
            a small team of music lovers and sound specialists who are devoted
            to helping you get the most out of personal audio. Come and visit
            our demo facility - we're open 7 days a week.
          </p>
          <ul className="flex items-center gap-4 mt-10">
            <li>
              <FacebookIcon className="cursor-pointer text-white hover:text-warm-orange-brown transition-colors duration-300" />
            </li>
            <li>
              <TwitterIcon className="cursor-pointer text-white hover:text-warm-orange-brown transition-colors duration-300" />
            </li>
            <li>
              <InstagramIcon className="cursor-pointer text-white hover:text-warm-orange-brown transition-colors duration-300" />
            </li>
          </ul>
        </div>

        <div className="mt-8 xs:text-center md:text-left">
          <div className="text-white opacity-50 text-sm">
            Copyright 2021. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
