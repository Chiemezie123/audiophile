import crypto from "node:crypto";

import { getDb, nowIso } from "./db";

const OTP_TTL_MS = 10 * 60 * 1000;
const SECRET = process.env.AUTH_SECRET || "fuzzybeats-local-auth-secret";

export const SESSION_COOKIE_NAME = "fuzzybeats_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type PrismaUserShape = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  newsletterOptIn?: boolean;
  storeCredit?: number;
  photo?: string;
  authProvider: string;
  isEmailVerified: boolean;
  role: string;
};

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [salt, derivedHash] = storedHash.split(":");
  const nextHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(derivedHash, "hex"),
    Buffer.from(nextHash, "hex")
  );
}

function signToken(payload: { userId: string; email: string }) {
  const encodedPayload = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Date.now(),
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function createSessionTokenForUser(user: { id: string; email: string }) {
  return signToken({ userId: user.id, email: user.email });
}

export function verifyToken(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(encodedPayload)
    .digest("base64url");

  if (expectedSignature !== signature) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as {
      userId: string;
      email: string;
      iat: number;
    };
  } catch {
    return null;
  }
}

function sanitizeUser(user: PrismaUserShape) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    shippingAddress: user.shippingAddress || "",
    shippingCity: user.shippingCity || "",
    shippingState: user.shippingState || "",
    shippingCountry: user.shippingCountry || "",
    newsletterOptIn: Boolean(user.newsletterOptIn),
    storeCredit: Number(user.storeCredit || 0),
    photo: user.photo || "",
    authProvider: user.authProvider,
    isEmailVerified: Boolean(user.isEmailVerified),
    role: user.role,
  };
}

export async function userExistsByEmail(email: string) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  return Boolean(user);
}

export async function createOtpForEmail(email: string) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

  await db.otpCode.deleteMany({
    where: { email: normalizedEmail },
  });

  await db.otpCode.create({
    data: {
      email: normalizedEmail,
      codeHash: digest(otp),
      expiresAt: BigInt(Date.now() + OTP_TTL_MS),
      createdAt: new Date(),
    },
  });

  return otp;
}

export async function verifyOtpForEmail(email: string, otp: string) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const otpRow = await db.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      usedAt: null,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!otpRow) {
    return false;
  }

  const isValid =
    Number(otpRow.expiresAt) > Date.now() && otpRow.codeHash === digest(otp);

  if (isValid) {
    await db.otpCode.update({
      where: { id: otpRow.id },
      data: { usedAt: BigInt(Date.now()) },
    });
  }

  return isValid;
}

export async function createOrUpdatePasswordUser(email: string, password: string) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const existingUser = await db.user.findUnique({
    where: { email: normalizedEmail },
  });

  const user = existingUser
    ? await db.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          authProvider: "local",
          isEmailVerified: true,
          updatedAt: new Date(),
        },
      })
    : await db.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName: "",
          lastName: "",
          phone: "",
          shippingAddress: "",
          shippingCity: "",
          shippingState: "",
          shippingCountry: "",
          newsletterOptIn: true,
          storeCredit: 0,
          photo: "",
          authProvider: "local",
          isEmailVerified: true,
          role: "user",
        },
      });

  const sanitizedUser = sanitizeUser(user);

  return {
    user: sanitizedUser,
    token: signToken({ userId: sanitizedUser.id, email: sanitizedUser.email }),
  };
}

export async function createOrUpdateGoogleUser(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  googleId: string;
}) {
  const db = await getDb();
  const normalizedEmail = input.email.trim().toLowerCase();
  const firstName = input.firstName?.trim() || "";
  const lastName = input.lastName?.trim() || "";
  const photo = input.photo || "";

  const existingAccount = await db.authAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: input.googleId,
      },
    },
    include: {
      user: true,
    },
  });

  const existingUserByEmail =
    existingAccount?.user ||
    (await db.user.findUnique({
      where: { email: normalizedEmail },
    }));

  const user = existingUserByEmail
    ? await db.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          firstName: existingUserByEmail.firstName || firstName,
          lastName: existingUserByEmail.lastName || lastName,
          photo: existingUserByEmail.photo || photo,
          authProvider: "google",
          isEmailVerified: true,
          updatedAt: new Date(),
        },
      })
    : await db.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: null,
          firstName,
          lastName,
          phone: "",
          shippingAddress: "",
          shippingCity: "",
          shippingState: "",
          shippingCountry: "",
          newsletterOptIn: true,
          storeCredit: 0,
          photo,
          authProvider: "google",
          isEmailVerified: true,
          role: "user",
        },
      });

  await db.authAccount.upsert({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: input.googleId,
      },
    },
    update: {
      userId: user.id,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      provider: "google",
      providerAccountId: input.googleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const sanitizedUser = sanitizeUser(user);

  return {
    user: sanitizedUser,
    token: createSessionTokenForUser(sanitizedUser),
  };
}

export async function loginUser(email: string, password: string) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return null;
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return null;
  }

  await db.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  const sanitizedUser = sanitizeUser(user);

  return {
    user: sanitizedUser,
    token: signToken({ userId: sanitizedUser.id, email: sanitizedUser.email }),
  };
}

export async function updateUserProfileFromToken(
  token: string,
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    shippingAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingCountry?: string;
    newsletterOptIn?: boolean;
  }
) {
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const db = await getDb();
  const updatedUser = await db.user.update({
    where: { id: payload.userId },
    data: {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: profile.phone?.trim() || "",
      shippingAddress: profile.shippingAddress?.trim() || "",
      shippingCity: profile.shippingCity?.trim() || "",
      shippingState: profile.shippingState?.trim() || "",
      shippingCountry: profile.shippingCountry?.trim() || "",
      newsletterOptIn:
        typeof profile.newsletterOptIn === "boolean"
          ? profile.newsletterOptIn
          : true,
      updatedAt: new Date(),
    },
  });

  return sanitizeUser(updatedUser);
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const db = await getDb();
  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
}
