"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useRef } from "react";
import { accountModalData } from "@/constants/data";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn, LogOut, Sparkles, UserPlus } from "lucide-react";

const AccountModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` || "FB";

  return (
    <div
      ref={modalRef}
      className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.8rem] border border-white/12 bg-[rgba(19,20,24,0.96)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(216,125,74,0.22),rgba(255,255,255,0.02))] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#f1c2a4]">
              Account
            </p>
            <h3 className="mt-3 text-xl font-black text-white">
              {isAuthenticated && user
                ? `${user.firstName || "FuzzyBeats"} ${user.lastName || "Member"}`
                : "Welcome to FuzzyBeats"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/64">
              {isAuthenticated && user
                ? user.email
                : "Sign in or create an account to track orders and keep your cart across sessions."}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm font-black uppercase text-white">
            {initials}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          {isAuthenticated ? (
            <Button
              className="flex-1"
              onClick={async () => {
                await logout();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                className="flex-1"
                onClick={() => {
                  onClose();
                  router.push("/signup");
                }}
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Button>
              <Button
                variant="secondary"
                className="flex-1 border-white/14 text-white hover:border-white/18 hover:bg-white hover:text-[#15161a]"
                onClick={() => {
                  onClose();
                  router.push("/login");
                }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/42">
          <Sparkles className="h-3.5 w-3.5 text-[#d87d4a]" />
          Quick access
        </div>
        <div className="flex flex-col gap-1">
          {accountModalData.map((item, index) => {
            const Icon = item.imgSrc;
            return (
              <button
                key={index}
                className="group flex w-full items-center gap-3 rounded-[1.1rem] px-3 py-3 text-left transition hover:bg-white/6"
                onClick={() => {
                  onClose();
                  router.push(item.href);
                }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/82">
                  <Icon />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="capitalize text-[15px] font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-white/42">
                    {item.title === "wishlist"
                      ? "Save products for later"
                      : item.title === "my orders"
                      ? "Track purchases and delivery"
                      : "Manage your profile details"}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-[#d87d4a]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
