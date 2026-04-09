import Image from "next/image";

import AudioModel from "@/assets/Audio Model.webp";

const ActionCard = () => {
  return (
    <section className="mx-auto mt-24 max-w-[1180px] px-4 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2.5rem] bg-[#111215] lg:grid-cols-[1fr_0.95fr]">
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="absolute -left-16 top-6 h-40 w-40 rounded-full bg-[#d87d4a]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d9a07d]">
              Why FuzzyBeats
            </p>
            <h2 className="mt-6 text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl lg:text-5xl">
              Bringing you the best audio gear with a more considered buying experience.
            </h2>
            <p className="mt-6 text-sm leading-7 text-white/68 sm:text-base">
              We build every part of the store around product confidence: cleaner navigation,
              better storytelling, faster search, and premium visual presentation that helps
              shoppers understand what makes each product worth owning.
            </p>
          </div>
        </div>

        <div className="relative min-h-[24rem] bg-[#efe8de]">
          <Image
            src={AudioModel}
            alt="FuzzyBeats brand"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
        </div>
      </div>
    </section>
  );
};

export default ActionCard;
