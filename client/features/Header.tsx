"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Headphones,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import AccountModal from "./accountModal";
import CartModal from "@/components/ui/CartModal";
import { getProductImageSrc, type Product } from "@/lib/catalog";
import { searchCatalog } from "@/lib/catalog-api";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/categories/headphones", label: "Headphones" },
  { href: "/categories/speakers", label: "Speakers" },
  { href: "/categories/earphones", label: "Earphones" },
];

const Header = () => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { user, isAuthenticated } = useAuth();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const products = await searchCatalog(query);
      setSearchResults(products);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#111215]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setIsMobileNavOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="text-lg font-black uppercase tracking-[0.28em] text-white">
            FuzzyBeats
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.28em] transition",
                  isActive
                    ? "bg-white text-[#131418]"
                    : "text-white/72 hover:bg-white/8 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
              isSearchOpen
                ? "border-[#d87d4a] bg-[#d87d4a] text-white"
                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
            )}
            onClick={() => setIsSearchOpen((value) => !value)}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            onClick={() => setIsAccountModalOpen((value) => !value)}
            aria-label="Open account menu"
          >
            {isAuthenticated && user ? (
              <span className="text-sm font-black uppercase tracking-[0.08em] text-[#f7efe8]">
                {(user.firstName?.[0] || "") + (user.lastName?.[0] || "") || "FB"}
              </span>
            ) : (
              <UserRound className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#d87d4a] px-1 text-[0.62rem] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="border-t border-white/8 bg-[#111215] px-4 py-4 lg:hidden sm:px-6">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[1.2rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em]",
                    isActive
                      ? "bg-white text-[#131418]"
                      : "bg-white/5 text-white/72 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}

      {isSearchOpen ? (
        <div className="border-t border-white/8 bg-[#17191d] px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-black/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search headphones, speakers, earphones..."
                className="w-full border-none bg-transparent text-sm text-black outline-none placeholder:text-black/45"
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#101114]">
              {query.trim().length === 0 ? (
                <div className="flex items-center gap-4 px-5 py-5 text-white/65">
                  <Headphones className="h-5 w-5 text-[#d87d4a]" />
                  <p className="text-sm">
                    Search the full product catalog across all categories.
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="px-5 py-5 text-sm text-white/65">
                  No matching products found for “{query}”.
                </div>
              ) : (
                <div className="grid gap-px bg-white/8 md:grid-cols-2 xl:grid-cols-3">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-4 bg-[#101114] px-4 py-4 transition hover:bg-[#171a20]"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.1rem] bg-[#f4efe8] p-2">
                        <img
                          src={getProductImageSrc(product.cardImage)}
                          alt={product.name}
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                          {product.category}
                        </p>
                        <p className="mt-1 truncate text-sm font-bold uppercase tracking-[0.08em] text-white">
                          {product.shortName}
                        </p>
                        <p className="mt-1 text-sm text-[#d9a07d]">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {isAccountModalOpen ? (
        <div className="absolute right-4 top-[4.8rem] z-50 sm:right-6 lg:right-8">
          <AccountModal onClose={() => setIsAccountModalOpen(false)} />
        </div>
      ) : null}

      {isCartOpen ? <CartModal handleModalCloser={() => setIsCartOpen(false)} /> : null}
    </header>
  );
};

export default Header;
