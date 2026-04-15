"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CreditCard,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import CategoryCard from "@/components/ui/CategoryCard";
import { useAuth } from "@/contexts/AuthContext";
import ActionCard from "@/features/ActionCard";
import Footer from "@/features/Footer";
import Header from "@/features/Header";
import { homeCategoryCards } from "@/lib/catalog";
import { toastUtils } from "@/lib/toastUtils";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  newsletterOptIn: boolean;
  storeCredit: number;
};

const emptyProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingCountry: "",
  newsletterOptIn: true,
  storeCredit: 0,
};

export default function MyAccountPage() {
  const { user, isAuthenticated, isAuthResolved, setUser } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        shippingAddress: user.shippingAddress || "",
        shippingCity: user.shippingCity || "",
        shippingState: user.shippingState || "",
        shippingCountry: user.shippingCountry || "",
        newsletterOptIn: user.newsletterOptIn ?? true,
        storeCredit: user.storeCredit || 0,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !isAuthResolved) {
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const response = await fetch("/api/v1/account/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Failed to load account profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [isAuthenticated, isAuthResolved, setUser]);

  const handleChange = (
    field: keyof ProfileForm,
    value: string | boolean | number
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      toastUtils.error("First name and last name are required.");
      return;
    }

    setIsSaving(true);
    const loadingToast = toastUtils.loading("Saving account changes...");

    try {
      const response = await fetch("/api/v1/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          shippingAddress: profile.shippingAddress,
          shippingCity: profile.shippingCity,
          shippingState: profile.shippingState,
          shippingCountry: profile.shippingCountry,
          newsletterOptIn: profile.newsletterOptIn,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toastUtils.updateLoading(
          loadingToast,
          `❌ ${result.message || "Failed to update account."}`,
          "error"
        );
        return;
      }

      if (result.user) {
        setUser(result.user);
      }

      setIsEditingAccount(false);
      setIsEditingAddress(false);
      toastUtils.updateLoading(
        loadingToast,
        "✅ Account details updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Failed to save account profile:", error);
      toastUtils.updateLoading(
        loadingToast,
        "🔴 Network error. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthResolved || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
        <Header />
        <main className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(16,18,25,0.08)]">
            <p className="text-sm text-[#5f6470]">Loading your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
        <Header />
        <main className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(16,18,25,0.08)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d87d4a]">
              My Account
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#24262d]">
              Sign in to view your account details.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f6470]">
              Your account overview, saved address, and profile settings are only
              available for authenticated users.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#24262d]/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[#24262d] transition hover:border-[#24262d]/18 hover:bg-[#24262d] hover:text-white"
              >
                Back Home
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b]"
              >
                Log In
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-[#24262d]/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[#24262d] transition hover:border-[#24262d]/18 hover:bg-[#24262d] hover:text-white"
              >
                Create Account
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
        <ActionCard />
        <Footer />
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Your name";
  const addressLine = [
    profile.shippingAddress,
    profile.shippingCity,
    profile.shippingState,
    profile.shippingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
      <Header />

      <main>
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[2rem] bg-white shadow-[0_18px_60px_rgba(16,18,25,0.08)]">
          <div className="border-b border-[#ece7df] px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#5f6470] transition hover:text-[#d87d4a]"
                >
                  Back Home
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#d87d4a]">
                  Account Overview
                </p>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#24262d] sm:text-4xl">
                  Manage your profile, address book, and account preferences.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f6470] sm:text-base">
                  Keep your details current so checkout stays fast and your
                  orders remain easy to manage across devices.
                </p>
              </div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#d87d4a]/12 text-[#d87d4a]">
                <UserRound className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 sm:p-8">
            <section className="rounded-[1.5rem] border border-[#ddd5cb] bg-white">
              <div className="flex items-center justify-between border-b border-[#ece7df] px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6470]">
                    Account Details
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-[#24262d]">
                    Identity and sign-in profile
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAccount((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d87d4a]/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d87d4a] transition hover:bg-[#d87d4a] hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingAccount ? "Close" : "Edit"}
                </button>
              </div>

              <div className="space-y-4 px-6 py-6">
                {isEditingAccount ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                        First Name
                        <input
                          value={profile.firstName}
                          onChange={(event) =>
                            handleChange("firstName", event.target.value)
                          }
                          className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                        Last Name
                        <input
                          value={profile.lastName}
                          onChange={(event) =>
                            handleChange("lastName", event.target.value)
                          }
                          className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                      Email Address
                      <input
                        value={profile.email}
                        readOnly
                        className="h-12 rounded-xl border border-[#ece7df] bg-[#f7f4ef] px-4 text-[#5f6470] outline-none"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                      Phone Number
                      <input
                        value={profile.phone}
                        onChange={(event) =>
                          handleChange("phone", event.target.value)
                        }
                        className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        placeholder="Add a contact number"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-[#24262d]">{fullName}</p>
                    <div className="space-y-2 text-[#5f6470]">
                      <p className="flex items-center gap-3 text-base">
                        <Mail className="h-4 w-4 text-[#d87d4a]" />
                        {profile.email}
                      </p>
                      <p className="flex items-center gap-3 text-base">
                        <ShieldCheck className="h-4 w-4 text-[#d87d4a]" />
                        {profile.phone || "No phone number saved yet."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#ddd5cb] bg-white">
              <div className="flex items-center justify-between border-b border-[#ece7df] px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6470]">
                    Address Book
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-[#24262d]">
                    Default shipping details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d87d4a]/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d87d4a] transition hover:bg-[#d87d4a] hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isEditingAddress ? "Close" : "Edit"}
                </button>
              </div>

              <div className="space-y-4 px-6 py-6">
                {isEditingAddress ? (
                  <>
                    <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                      Street Address
                      <input
                        value={profile.shippingAddress}
                        onChange={(event) =>
                          handleChange("shippingAddress", event.target.value)
                        }
                        className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        placeholder="House number and street"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                        City
                        <input
                          value={profile.shippingCity}
                          onChange={(event) =>
                            handleChange("shippingCity", event.target.value)
                          }
                          className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                        State / Region
                        <input
                          value={profile.shippingState}
                          onChange={(event) =>
                            handleChange("shippingState", event.target.value)
                          }
                          className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm font-medium text-[#24262d]">
                      Country
                      <input
                        value={profile.shippingCountry}
                        onChange={(event) =>
                          handleChange("shippingCountry", event.target.value)
                        }
                        className="h-12 rounded-xl border border-[#d8d0c6] px-4 outline-none transition focus:border-[#d87d4a]"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-[#24262d]">
                      Your default shipping address:
                    </p>
                    <div className="space-y-2 text-[#5f6470]">
                      <p>{fullName}</p>
                      <p>{addressLine || "No shipping address saved yet."}</p>
                      <p>{profile.phone || "No delivery phone number saved yet."}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#ddd5cb] bg-white">
              <div className="border-b border-[#ece7df] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6470]">
                  Store Credit
                </p>
                <h2 className="mt-2 text-lg font-bold text-[#24262d]">
                  FuzzyBeats wallet balance
                </h2>
              </div>
              <div className="px-6 py-6">
                <p className="flex items-center gap-3 text-xl font-semibold text-[#3652a5]">
                  <CreditCard className="h-5 w-5" />
                  FuzzyBeats store credit balance: ${profile.storeCredit}
                </p>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#ddd5cb] bg-white">
              <div className="border-b border-[#ece7df] px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6470]">
                  Newsletter Preferences
                </p>
                <h2 className="mt-2 text-lg font-bold text-[#24262d]">
                  Email communication settings
                </h2>
              </div>
              <div className="space-y-5 px-6 py-6">
                <p className="text-sm leading-7 text-[#5f6470]">
                  Manage your email communications to stay updated with the latest
                  product drops and offers.
                </p>
                <label className="flex items-center justify-between gap-4 rounded-[1rem] bg-[#f7f4ef] px-4 py-4">
                  <div>
                    <p className="font-semibold text-[#24262d]">Receive newsletters</p>
                    <p className="text-sm text-[#5f6470]">
                      Product launches, curated offers, and audio updates.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.newsletterOptIn}
                    onChange={(event) =>
                      handleChange("newsletterOptIn", event.target.checked)
                    }
                    className="h-5 w-5 accent-[#d87d4a]"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#ece7df] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-semibold text-[#24262d]">Save account changes</p>
              <p className="text-sm text-[#5f6470]">
                Your profile, address book, and newsletter settings are saved together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-full border border-[#24262d]/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[#24262d] transition hover:border-[#24262d]/18 hover:bg-[#24262d] hover:text-white"
              >
                View Checkout
                <ChevronRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
                Keep shopping
              </p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em]">
                Explore more categories
              </h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {homeCategoryCards.map((card) => (
              <CategoryCard
                key={card.category}
                image={card.image}
                label={card.label}
                href={`/categories/${card.category}`}
                eyebrow="Suggested for you"
              />
            ))}
          </div>
        </section>
      </main>

      <ActionCard />
      <Footer />
    </div>
  );
}
