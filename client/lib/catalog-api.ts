import type { Product } from "./catalog";

export async function fetchCatalogProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return [] as Product[];
  }

  const response = await fetch(
    `/api/v1/catalog?slugs=${encodeURIComponent(slugs.join(","))}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [] as Product[];
  }

  const result = await response.json();
  return Array.isArray(result.products) ? (result.products as Product[]) : [];
}

export async function searchCatalog(query: string) {
  if (!query.trim()) {
    return [] as Product[];
  }

  const response = await fetch(
    `/api/v1/catalog?query=${encodeURIComponent(query.trim())}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [] as Product[];
  }

  const result = await response.json();
  return Array.isArray(result.products) ? (result.products as Product[]) : [];
}
