export const productSeed = [
  {
    slug: "xx99-mark-ii-headphones",
    categorySlug: "headphones",
    name: "XX99 Mark II Headphones",
    shortName: "XX99 Mark II",
    price: 2999,
  },
  {
    slug: "xx99-mark-i-headphones",
    categorySlug: "headphones",
    name: "XX99 Mark I Headphones",
    shortName: "XX99 Mark I",
    price: 1750,
  },
  {
    slug: "xx59-headphones",
    categorySlug: "headphones",
    name: "XX59 Headphones",
    shortName: "XX59",
    price: 899,
  },
  {
    slug: "zx9-speaker",
    categorySlug: "speakers",
    name: "ZX9 Speaker",
    shortName: "ZX9",
    price: 4500,
  },
  {
    slug: "zx7-speaker",
    categorySlug: "speakers",
    name: "ZX7 Speaker",
    shortName: "ZX7",
    price: 3500,
  },
  {
    slug: "yx1-wireless-earphones",
    categorySlug: "earphones",
    name: "YX1 Wireless Earphones",
    shortName: "YX1",
    price: 599,
  },
] as const;

export const categorySeed = [
  { slug: "headphones", name: "Headphones" },
  { slug: "speakers", name: "Speakers" },
  { slug: "earphones", name: "Earphones" },
] as const;
