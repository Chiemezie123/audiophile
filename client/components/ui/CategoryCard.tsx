import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CategoryCardProps = {
  image: StaticImageData;
  label: string;
  href: string;
  eyebrow?: string;
};

const CategoryCard = ({
  image,
  label,
  href,
  eyebrow = "Browse category",
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/75 p-6 shadow-[0_24px_60px_rgba(16,18,25,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(16,18,25,0.12)]"
    >
      <div className="absolute inset-x-6 top-6 h-28 rounded-full bg-[radial-gradient(circle,_rgba(216,125,74,0.18),_transparent_72%)]" />
      <div className="relative flex min-h-[14rem] flex-col justify-between gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-black/45">
              {eyebrow}
            </p>
            <h3 className="mt-3 text-xl font-black uppercase tracking-[0.14em] text-[#15161a]">
              {label}
            </h3>
          </div>
          <span className="rounded-full border border-black/10 bg-white/85 p-2 text-[#d87d4a] transition group-hover:border-[#d87d4a]/40 group-hover:bg-[#d87d4a] group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="relative mx-auto flex h-40 w-full items-end justify-center">
          <Image
            src={image}
            alt={label}
            className="max-h-full w-auto object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.2)] transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
