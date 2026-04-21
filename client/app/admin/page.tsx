"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "@/features/Header";
import Footer from "@/features/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/lib/catalog";
import { toastUtils } from "@/lib/toastUtils";

type AdminProduct = {
  slug: string;
  categorySlug: string;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  description: string;
  isNew: boolean;
  imageUrls: string[];
  features: string[];
  includes: string[];
  relatedSlugs: string[];
  accent: string;
};

const emptyForm = {
  categorySlug: "headphones",
  slug: "",
  name: "",
  shortName: "",
  price: "",
  tagline: "",
  description: "",
  isNew: false,
  features: "",
  includes: "",
  relatedSlugs: "",
  accent: "oklch(0.7 0.08 40)",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAuthResolved } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  const relatedProductOptions = useMemo(
    () => products.map((product) => ({ slug: product.slug, name: product.shortName })),
    [products]
  );

  useEffect(() => {
    if (!isAuthResolved) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/v1/admin/products", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();
        setProducts(Array.isArray(result.products) ? result.products : []);
      } catch (error) {
        console.error("Failed to load admin products:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [isAdmin, isAuthenticated, isAuthResolved, router]);

  const updateForm = (field: keyof typeof emptyForm, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetEditor = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setCurrentImageUrls([]);
    setSelectedFiles([]);
  };

  useEffect(() => {
    const nextPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(nextPreviews);

    return () => {
      nextPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleEditProduct = (product: AdminProduct) => {
    setEditingSlug(product.slug);
    setForm({
      categorySlug: product.categorySlug,
      slug: product.slug,
      name: product.name,
      shortName: product.shortName,
      price: String(product.price),
      tagline: product.tagline,
      description: product.description,
      isNew: product.isNew,
      features: product.features.join("\n"),
      includes: product.includes.join("\n"),
      relatedSlugs: product.relatedSlugs.join(", "),
      accent: product.accent,
    });
    setCurrentImageUrls(product.imageUrls);
    setSelectedFiles([]);
  };

  const moveCurrentImage = (index: number, direction: -1 | 1) => {
    setCurrentImageUrls((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const removeCurrentImage = (index: number) => {
    setCurrentImageUrls((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const moveSelectedFile = (index: number, direction: -1 | 1) => {
    setSelectedFiles((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  function toSlug(str: string) {
    return str.trim().split(' ').join('-');
  }


  const handleSubmitProduct = async () => {
    const pendingImageCount = currentImageUrls.length + selectedFiles.length;

    if (pendingImageCount < 3 || pendingImageCount > 5) {
      toastUtils.error("Each product must end up with between 3 and 5 images.");
      return;
    }

    setSaving(true);
    const loadingToast = toastUtils.loading(
      editingSlug ? "Updating product..." : "Creating product..."
    );

    try {
      let imageUrls = [...currentImageUrls];

      if (selectedFiles.length > 0) {
        const uploadForm = new FormData();
        selectedFiles.forEach((file) => uploadForm.append("files", file));

        const uploadResponse = await fetch("/api/v1/admin/uploads", {
          method: "POST",
          credentials: "include",
          body: uploadForm,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          toastUtils.updateLoading(
            loadingToast,
            `❌ ${uploadResult.message || "Failed to upload product images."}`,
            "error"
          );
          return;
        }

        imageUrls = [...imageUrls, ...uploadResult.imageUrls];
      }

      const response = await fetch(
        editingSlug
          ? `/api/v1/admin/products/${editingSlug}`
          : "/api/v1/admin/products",
        {
          method: editingSlug ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            categorySlug: form.categorySlug,
            slug: toSlug(form.slug),
            name: form.name.trim(),
            shortName: form.shortName.trim(),
            price: Number(form.price),
            tagline: form.tagline.trim(),
            description: form.description.trim(),
            isNew: form.isNew,
            imageUrls,
            features: form.features
              .split("\n")
              .map((value) => value.trim())
              .filter(Boolean),
            includes: form.includes
              .split("\n")
              .map((value) => value.trim())
              .filter(Boolean),
            relatedSlugs: form.relatedSlugs
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
            accent: form.accent.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toastUtils.updateLoading(
          loadingToast,
          `❌ ${result.message || `Failed to ${editingSlug ? "update" : "create"} product.`}`,
          "error"
        );
        return;
      }

      setProducts((current) => {
        if (editingSlug) {
          return current.map((product) =>
            product.slug === editingSlug ? result.product : product
          );
        }

        return [result.product, ...current];
      });
      resetEditor();
      toastUtils.updateLoading(
        loadingToast,
        editingSlug
          ? "✅ Product updated successfully."
          : "✅ Product created successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        `Failed to ${editingSlug ? "update" : "create"} admin product:`,
        error
      );
      toastUtils.updateLoading(
        loadingToast,
        "🔴 Network error. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files.slice(0, 5));
  };

  const handleDeleteProduct = async (slug: string) => {
    try {
      const response = await fetch(`/api/v1/admin/products/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        toastUtils.error("Failed to delete product.");
        return;
      }

      setProducts((current) => current.filter((product) => product.slug !== slug));
      toastUtils.success("Product deleted.");
    } catch (error) {
      console.error("Failed to delete admin product:", error);
      toastUtils.error("Failed to delete product.");
    }
  };


 
  if (!isAuthResolved || loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
        <Header />
        <main className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(16,18,25,0.08)]">
            Loading admin dashboard...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
        <Header />
        <main className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white p-10 shadow-[0_20px_60px_rgba(16,18,25,0.08)]">
            <ShieldAlert className="h-10 w-10 text-[#d87d4a]" />
            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#24262d]">
              Admin access only
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f6470]">
              This dashboard is restricted to users whose role is set to `admin`.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#15161a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#d87d4a]"
              >
                Back Home
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#131418]">
      <Header />
      <main className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_24px_60px_rgba(16,18,25,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d87d4a]">
            Admin CMS
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-[#24262d]">
            Manage storefront products by category.
          </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f6470]">
            Add headphones, speakers, and earphones directly into the database. Newly
            created products will appear on their category pages and product routes.
            Each product must include between 3 and 5 Cloudinary-hosted images.
          </p>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_24px_60px_rgba(16,18,25,0.08)]">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-[#d87d4a]" />
              <h2 className="text-2xl font-black uppercase tracking-[0.08em]">
                {editingSlug ? "Edit Product" : "Add Product"}
              </h2>
            </div>

            {editingSlug ? (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.2rem] border border-[#d87d4a]/20 bg-[#fff4ee] px-4 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d87d4a]">
                    Editing
                  </p>
                  <p className="mt-1 text-sm text-[#5f6470]">
                    Updating <span className="font-semibold text-[#24262d]">{editingSlug}</span>.
                    You can reorder existing images, remove them, and add replacements before saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetEditor}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#24262d] transition hover:border-[#d87d4a] hover:text-[#d87d4a]"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Category
                <select
                  value={form.categorySlug}
                  onChange={(event) => updateForm("categorySlug", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#d87d4a]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Slug
                <input
                  value={form.slug}
                  onChange={(event) => updateForm("slug", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                  placeholder="my-new-product"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Product Name
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Short Name
                <input
                  value={form.shortName}
                  onChange={(event) => updateForm("shortName", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Price
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => updateForm("price", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Accent Color
                <input
                  value={form.accent}
                  onChange={(event) => updateForm("accent", event.target.value)}
                  className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
              Tagline
              <input
                value={form.tagline}
                onChange={(event) => updateForm("tagline", event.target.value)}
                className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
              />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                className="min-h-28 rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#d87d4a]"
              />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
              Product Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelection}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#15161a] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.18em] file:text-white"
              />
              <span className="text-xs font-medium text-[#5f6470]">
                Choose 3 to 5 total images. Uploaded files go to Cloudinary and are stored as CDN URLs.
              </span>
            </label>

            {currentImageUrls.length > 0 ? (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                    Current Gallery Order
                  </p>
                  <p className="text-xs text-[#5f6470]">
                    First image becomes the primary product image.
                  </p>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currentImageUrls.map((url, index) => (
                    <div
                      key={url}
                      className="overflow-hidden rounded-[1.2rem] border border-black/8 bg-[#fbfaf7]"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Current product image ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-black/8 px-3 py-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                          Slot {index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveCurrentImage(index, -1)}
                            disabled={index === 0}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:text-[#d87d4a] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Move image ${index + 1} left`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCurrentImage(index, 1)}
                            disabled={index === currentImageUrls.length - 1}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:text-[#d87d4a] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Move image ${index + 1} right`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCurrentImage(index)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:bg-[#d87d4a] hover:text-white"
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {imagePreviewUrls.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={url}
                    className="overflow-hidden rounded-[1.2rem] border border-black/8 bg-[#fbfaf7]"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Selected product preview ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-black/8 px-3 py-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                        New {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveSelectedFile(index, -1)}
                          disabled={index === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:text-[#d87d4a] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Move selected image ${index + 1} left`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSelectedFile(index, 1)}
                          disabled={index === imagePreviewUrls.length - 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:text-[#d87d4a] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Move selected image ${index + 1} right`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:bg-[#d87d4a] hover:text-white"
                          aria-label={`Remove selected image ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-[1.2rem] border border-dashed border-black/10 bg-[#fbfaf7] px-4 py-5 text-sm text-[#5f6470]">
                <ImagePlus className="h-4 w-4 text-[#d87d4a]" />
                No product images selected yet.
              </div>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Features
                <textarea
                  value={form.features}
                  onChange={(event) => updateForm("features", event.target.value)}
                  className="min-h-32 rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#d87d4a]"
                  placeholder={"One feature per line"}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
                Includes
                <textarea
                  value={form.includes}
                  onChange={(event) => updateForm("includes", event.target.value)}
                  className="min-h-32 rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#d87d4a]"
                  placeholder={"Use one line per item, e.g. 1x Charging cable"}
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#24262d]">
              Related Product Slugs
              <input
                value={form.relatedSlugs}
                onChange={(event) => updateForm("relatedSlugs", event.target.value)}
                className="h-12 rounded-xl border border-black/10 px-4 outline-none focus:border-[#d87d4a]"
                placeholder={relatedProductOptions.map((item) => item.slug).slice(0, 3).join(", ")}
              />
            </label>

            <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[#24262d]">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(event) => updateForm("isNew", event.target.checked)}
                className="h-4 w-4 accent-[#d87d4a]"
              />
              Mark as new arrival
            </label>

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmitProduct}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d87d4a] px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#f0a57b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingSlug ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? (editingSlug ? "Updating..." : "Creating...") : editingSlug ? "Update Product" : "Create Product"}
            </button>
          </div>

          <div className="rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_24px_60px_rgba(16,18,25,0.08)]">
            <h2 className="text-2xl font-black uppercase tracking-[0.08em] text-[#24262d]">
              Existing Products
            </h2>
            <div className="mt-6 flex flex-col gap-4 overflow-y-auto max-h-[1000px] no-scrollbar">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="rounded-[1.4rem] border border-black/8 bg-[#fbfaf7] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">
                        {product.categorySlug}
                      </p>
                      <p className="mt-2 text-lg font-black uppercase tracking-[0.08em] text-[#24262d]">
                        {product.shortName}
                      </p>
                      <p className="mt-1 text-sm text-[#5f6470]">{product.slug}</p>
                      <p className="mt-2 text-sm font-semibold text-[#d87d4a]">
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-black/40">
                        {product.imageUrls.length} image(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:bg-[#fff4ee] hover:text-[#d87d4a]"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.slug)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-[#d87d4a] hover:bg-[#d87d4a] hover:text-white"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#15161a] transition hover:text-[#d87d4a]"
                  >
                    View product page
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}

              {products.length === 0 ? (
                <p className="text-sm text-[#5f6470]">No products available yet.</p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
