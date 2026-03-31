import type { StaticImageData } from "next/image";

import HeadphonesHero from "@/assets/Headphones.png";
import HeadphonesCategoryThumb from "@/assets/Headphones 2.png";
import HeadphonesMarkII from "@/assets/Headphones3.png";
import HeadphonesXX59 from "@/assets/Headphones4.png";
import EarphonesThumb from "@/assets/Earphones.png";
import EarphonesLifestyle from "@/assets/Earphones2.png";
import SpeakersZX9 from "@/assets/Speakers.png";
import SpeakersThumb from "@/assets/Speakers2.png";
import SpeakersZX7Lifestyle from "@/assets/Speakers3.png";
import SpeakersZX7 from "@/assets/Speakers4.png";
import DisplayHeadphones1 from "@/assets/DisplayHeadphones1.png";
import DisplayHeadphones2 from "@/assets/DisplayHeadphones2.png";
import DisplayHeadphones3 from "@/assets/DisplayHeadphones3.png";
import DisplayEarphones1 from "@/assets/DisplayEarphones1.png";
import DisplayEarphones2 from "@/assets/DisplayEarphones2.png";
import DisplayEarphones3 from "@/assets/DisplayEarphones3.png";
import DisplaySpeakers1 from "@/assets/DisplaySpeakers1.png";
import DisplaySpeakers2 from "@/assets/DisplaySpeakers2.png";
import DisplaySpeakers3 from "@/assets/DisplaySpeakers3.png";

export const categories = ["headphones", "speakers", "earphones"] as const;

export type CategorySlug = (typeof categories)[number];

export type Product = {
  id: string;
  slug: string;
  category: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  isNew: boolean;
  description: string;
  heroImage: StaticImageData;
  cardImage: StaticImageData;
  gallery: [StaticImageData, StaticImageData, StaticImageData];
  features: string[];
  includes: Array<{ quantity: number; item: string }>;
  relatedSlugs: string[];
  accent: string;
};

type CategoryMeta = {
  slug: CategorySlug;
  name: string;
  headline: string;
  description: string;
  heroImage: StaticImageData;
};

export const categoryMeta: Record<CategorySlug, CategoryMeta> = {
  headphones: {
    slug: "headphones",
    name: "Headphones",
    headline: "Reference-grade listening for long studio sessions and everyday immersion.",
    description:
      "From flagship over-ear sets to versatile daily drivers, our headphone collection balances precision, comfort, and striking industrial design.",
    heroImage: HeadphonesCategoryThumb,
  },
  speakers: {
    slug: "speakers",
    name: "Speakers",
    headline: "Room-filling sound systems engineered for depth, control, and presence.",
    description:
      "Explore powered speakers designed to anchor living rooms, studios, and premium listening spaces with confident detail.",
    heroImage: SpeakersThumb,
  },
  earphones: {
    slug: "earphones",
    name: "Earphones",
    headline: "Compact wireless performance tuned for travel, focus, and comfort.",
    description:
      "Discover lightweight earphones with active noise cancellation, rich detail, and the flexibility to move between work and play.",
    heroImage: EarphonesThumb,
  },
};

export const productsByCategory: Record<CategorySlug, Product[]> = {
  headphones: [
    {
      id: "headphones-xx99-mark-ii",
      slug: "xx99-mark-ii-headphones",
      category: "headphones",
      name: "XX99 Mark II Headphones",
      shortName: "XX99 Mark II",
      tagline: "Flagship clarity for serious listeners",
      price: 2999,
      isNew: true,
      description:
        "The XX99 Mark II is tuned for listeners who want studio-level detail with luxurious all-day comfort. Its carbon driver system delivers wide soundstage, tight bass control, and exceptional vocal presence.",
      heroImage: HeadphonesMarkII,
      cardImage: HeadphonesMarkII,
      gallery: [DisplayHeadphones1, DisplayHeadphones2, DisplayHeadphones3],
      features: [
        "Built with an acoustically balanced enclosure and premium driver architecture, the XX99 Mark II reproduces tracks with the precision of a mastering suite while staying engaging enough for everyday listening.",
        "Soft-touch memory foam, an adjustable headband, and low-distortion wireless playback make it an easy recommendation for long listening sessions, focused work, and high-resolution streaming.",
      ],
      includes: [
        { quantity: 1, item: "Headphone unit" },
        { quantity: 2, item: "Replacement earcups" },
        { quantity: 1, item: "Travel case" },
        { quantity: 1, item: "3.5mm audio cable" },
        { quantity: 1, item: "Charging cable" },
      ],
      relatedSlugs: [
        "xx99-mark-i-headphones",
        "xx59-headphones",
        "zx9-speaker",
      ],
      accent: "oklch(0.74 0.11 45)",
    },
    {
      id: "headphones-xx99-mark-i",
      slug: "xx99-mark-i-headphones",
      category: "headphones",
      name: "XX99 Mark I Headphones",
      shortName: "XX99 Mark I",
      tagline: "Classic gold-standard performance",
      price: 1750,
      isNew: false,
      description:
        "A long-standing favorite for engineers and enthusiasts, the XX99 Mark I delivers articulate mids, controlled low end, and a fit designed for marathon sessions.",
      heroImage: HeadphonesCategoryThumb,
      cardImage: HeadphonesCategoryThumb,
      gallery: [DisplayHeadphones2, DisplayHeadphones1, DisplayHeadphones3],
      features: [
        "The XX99 Mark I focuses on tonal balance and consistency, making it a dependable choice for critical listening, editing, and everyday enjoyment.",
        "Its durable metal frame and refined cushioning keep the experience premium while maintaining the kind of neutrality that reveals more from your music library.",
      ],
      includes: [
        { quantity: 1, item: "Headphone unit" },
        { quantity: 2, item: "Replacement earcups" },
        { quantity: 1, item: "Travel pouch" },
        { quantity: 1, item: "6.3mm adapter" },
      ],
      relatedSlugs: [
        "xx99-mark-ii-headphones",
        "xx59-headphones",
        "yx1-wireless-earphones",
      ],
      accent: "oklch(0.68 0.08 55)",
    },
    {
      id: "headphones-xx59",
      slug: "xx59-headphones",
      category: "headphones",
      name: "XX59 Headphones",
      shortName: "XX59",
      tagline: "Versatile wireless performance",
      price: 899,
      isNew: false,
      description:
        "The XX59 offers energetic sound, lightweight comfort, and a durable wireless form factor for listeners who want reliable performance at home or on the move.",
      heroImage: HeadphonesXX59,
      cardImage: HeadphonesXX59,
      gallery: [DisplayHeadphones3, DisplayHeadphones1, DisplayHeadphones2],
      features: [
        "Designed for flexibility, the XX59 blends strong battery life with clear stereo imaging and punchy low frequencies that suit modern playlists.",
        "Its compact silhouette and fast pairing make it an ideal upgrade for shoppers moving into premium personal audio without needing a full reference rig.",
      ],
      includes: [
        { quantity: 1, item: "Headphone unit" },
        { quantity: 1, item: "Carrying pouch" },
        { quantity: 1, item: "USB-C cable" },
      ],
      relatedSlugs: [
        "xx99-mark-i-headphones",
        "xx99-mark-ii-headphones",
        "zx7-speaker",
      ],
      accent: "oklch(0.69 0.07 35)",
    },
  ],
  speakers: [
    {
      id: "speakers-zx9",
      slug: "zx9-speaker",
      category: "speakers",
      name: "ZX9 Speaker",
      shortName: "ZX9",
      tagline: "Statement sound with wireless freedom",
      price: 4500,
      isNew: true,
      description:
        "The ZX9 is our flagship active speaker, combining bookshelf precision with the scale and weight expected from a premium wireless centerpiece.",
      heroImage: SpeakersZX9,
      cardImage: SpeakersZX9,
      gallery: [DisplaySpeakers1, DisplaySpeakers2, DisplaySpeakers3],
      features: [
        "The ZX9 is engineered to perform as both a design object and a sonic anchor. Deep bass extension, crisp high frequencies, and strong wireless connectivity make it ideal for premium living spaces.",
        "Its sculpted cabinet reduces vibration while a powerful amplification stage keeps detail intact even at higher volumes, creating a presentation that feels expansive without becoming harsh.",
      ],
      includes: [
        { quantity: 2, item: "Speaker units" },
        { quantity: 2, item: "Speaker cloth panels" },
        { quantity: 1, item: "Remote control" },
        { quantity: 1, item: "User guide" },
        { quantity: 2, item: "Power cables" },
      ],
      relatedSlugs: [
        "zx7-speaker",
        "xx99-mark-ii-headphones",
        "yx1-wireless-earphones",
      ],
      accent: "oklch(0.76 0.12 50)",
    },
    {
      id: "speakers-zx7",
      slug: "zx7-speaker",
      category: "speakers",
      name: "ZX7 Speaker",
      shortName: "ZX7",
      tagline: "Compact bookshelf precision",
      price: 3500,
      isNew: false,
      description:
        "The ZX7 distills the power and tuning philosophy of the ZX9 into a smaller footprint suited for tighter rooms and focused listening spaces.",
      heroImage: SpeakersZX7,
      cardImage: SpeakersZX7,
      gallery: [DisplaySpeakers2, DisplaySpeakers1, DisplaySpeakers3],
      features: [
        "With premium-grade internal components and carefully controlled dispersion, the ZX7 brings clarity and control to both entertainment setups and dedicated music spaces.",
        "Its more compact cabinet keeps visual bulk low while preserving the authority and precision expected from a premium powered speaker system.",
      ],
      includes: [
        { quantity: 2, item: "Speaker units" },
        { quantity: 2, item: "Speaker cloth panels" },
        { quantity: 1, item: "Remote control" },
        { quantity: 2, item: "Power cables" },
      ],
      relatedSlugs: [
        "zx9-speaker",
        "xx59-headphones",
        "yx1-wireless-earphones",
      ],
      accent: "oklch(0.63 0.07 43)",
    },
  ],
  earphones: [
    {
      id: "earphones-yx1",
      slug: "yx1-wireless-earphones",
      category: "earphones",
      name: "YX1 Wireless Earphones",
      shortName: "YX1",
      tagline: "Portable detail with active noise control",
      price: 599,
      isNew: true,
      description:
        "The YX1 is built for mobility without sacrificing depth, offering active noise cancellation, secure fit, and a sound signature tuned for clarity in busy environments.",
      heroImage: EarphonesThumb,
      cardImage: EarphonesThumb,
      gallery: [DisplayEarphones1, DisplayEarphones2, DisplayEarphones3],
      features: [
        "The YX1 pairs compact form with mature tuning, creating a wireless earphone that feels responsive, balanced, and easy to live with throughout the day.",
        "Its adaptive noise control and ergonomic shell make it especially useful for commuting, focused work sessions, and listeners who want premium portability.",
      ],
      includes: [
        { quantity: 2, item: "Earphone units" },
        { quantity: 6, item: "Multi-size eartips" },
        { quantity: 1, item: "Charging case" },
        { quantity: 1, item: "USB-C cable" },
      ],
      relatedSlugs: [
        "xx59-headphones",
        "zx7-speaker",
        "xx99-mark-i-headphones",
      ],
      accent: "oklch(0.73 0.09 35)",
    },
  ],
};

export const allProducts = categories.flatMap((category) => productsByCategory[category]);

export function getCategoryProducts(category: string) {
  if (!categories.includes(category as CategorySlug)) {
    return null;
  }

  return productsByCategory[category as CategorySlug];
}

export function getProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug) ?? null;
}

export function getRelatedProducts(product: Product) {
  return product.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((value): value is Product => Boolean(value));
}

export function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return allProducts
    .map((product) => {
      const haystack = `${product.name} ${product.shortName} ${product.category} ${product.tagline} ${product.description}`.toLowerCase();
      const score =
        (product.name.toLowerCase().includes(normalizedQuery) ? 6 : 0) +
        (product.shortName.toLowerCase().includes(normalizedQuery) ? 5 : 0) +
        (product.category.toLowerCase().includes(normalizedQuery) ? 3 : 0) +
        (product.tagline.toLowerCase().includes(normalizedQuery) ? 2 : 0) +
        (haystack.includes(normalizedQuery) ? 1 : 0);

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.product.price - right.product.price)
    .slice(0, 6)
    .map((entry) => entry.product);
}

export const featuredProducts = {
  hero: getProductBySlug("xx99-mark-ii-headphones")!,
  statement: getProductBySlug("zx9-speaker")!,
  compact: getProductBySlug("zx7-speaker")!,
  portable: getProductBySlug("yx1-wireless-earphones")!,
};

export const homeCategoryCards = [
  {
    category: "headphones" as const,
    image: HeadphonesCategoryThumb,
    label: "Headphones",
  },
  {
    category: "speakers" as const,
    image: SpeakersThumb,
    label: "Speakers",
  },
  {
    category: "earphones" as const,
    image: EarphonesThumb,
    label: "Earphones",
  },
];

export const searchPreviewImage = {
  headphones: HeadphonesHero,
  speakers: SpeakersZX7Lifestyle,
  earphones: EarphonesLifestyle,
};
