import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/server/admin-auth";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_PRODUCT_FOLDER || "fuzzybeats/products";

function signCloudinaryParams(timestamp: number, folder: string) {
  const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha1").update(toSign).digest("hex");
}

export async function POST(request: Request) {
  const admin = await requireAdminUser(request);

  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { message: "Cloudinary environment variables are missing." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);

    if (files.length < 3 || files.length > 5) {
      return NextResponse.json(
        { message: "Products must include between 3 and 5 images." },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const timestamp = Math.floor(Date.now() / 1000);
        const uploadForm = new FormData();

        uploadForm.append("file", file);
        uploadForm.append("api_key", CLOUDINARY_API_KEY);
        uploadForm.append("timestamp", String(timestamp));
        uploadForm.append("folder", CLOUDINARY_FOLDER);
        uploadForm.append(
          "signature",
          signCloudinaryParams(timestamp, CLOUDINARY_FOLDER)
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadForm,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Cloudinary upload failed.");
        }

        const result = await response.json();
        return result.secure_url as string;
      })
    );

    return NextResponse.json({ imageUrls: uploadResults, status: "success" });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      { message: "Failed to upload product images." },
      { status: 500 }
    );
  }
}
