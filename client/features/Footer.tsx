import Link from "next/link";
import { Instagram, Music2, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-black/8 bg-[#101114] text-white">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9a07d]">
            FuzzyBeats
          </p>
          <h2 className="mt-5 max-w-xl text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
            Premium audio, curated for people who care how it sounds and how it feels.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68">
            FuzzyBeats is a modern audio retail experience focused on immersive product discovery,
            thoughtful guidance, and category-leading gear across headphones, speakers, and earphones.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/72">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/categories/headphones" className="transition hover:text-white">
                Headphones
              </Link>
              <Link href="/categories/speakers" className="transition hover:text-white">
                Speakers
              </Link>
              <Link href="/categories/earphones" className="transition hover:text-white">
                Earphones
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Follow
            </p>
            <div className="mt-4 flex items-center gap-3">
              {[Twitter, Instagram, Youtube, Music2].map((Icon, index) => (
                <span
                  key={index}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#d87d4a]/60 hover:bg-[#d87d4a] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-5 text-xs uppercase tracking-[0.22em] text-white/38 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Designed for immersive shopping</span>
          <span>Copyright 2026. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
