import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "auth.json");
const OTP_TTL_MS = 10 * 60 * 1000;
const SECRET = process.env.AUTH_SECRET || "fuzzybeats-local-auth-secret";
export const SESSION_COOKIE_NAME = "fuzzybeats_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type StoredUser = {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  authProvider: "local";
  isEmailVerified: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

type StoredOtp = {
  email: string;
  otpHash: string;
  expiresAt: number;
};

type AuthStore = {
  users: StoredUser[];
  otps: StoredOtp[];
};

const defaultStore: AuthStore = {
  users: [],
  otps: [],
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultStore, null, 2), "utf8");
  }
}

async function readStore(): Promise<AuthStore> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as AuthStore;
}

async function writeStore(store: AuthStore) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function verifyPassword(password: string, storedHash?: string) {
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
    return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      userId: string;
      email: string;
      iat: number;
    };
  } catch {
    return null;
  }
}

function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    photo: user.photo || "",
    authProvider: user.authProvider,
    isEmailVerified: user.isEmailVerified,
    role: user.role,
  };
}

export async function createOtpForEmail(email: string) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

  store.otps = store.otps.filter((entry) => entry.email !== normalizedEmail);
  store.otps.push({
    email: normalizedEmail,
    otpHash: digest(otp),
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  await writeStore(store);

  return otp;
}

export async function verifyOtpForEmail(email: string, otp: string) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  const otpEntry = store.otps.find((entry) => entry.email === normalizedEmail);

  if (!otpEntry) {
    return false;
  }

  const isValid =
    otpEntry.expiresAt > Date.now() && otpEntry.otpHash === digest(otp);

  if (isValid) {
    store.otps = store.otps.filter((entry) => entry.email !== normalizedEmail);
    await writeStore(store);
  }

  return isValid;
}

export async function createOrUpdatePasswordUser(email: string, password: string) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password);
  let user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash,
      firstName: "",
      lastName: "",
      photo: "",
      authProvider: "local",
      isEmailVerified: true,
      role: "user",
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(user);
  } else {
    user.passwordHash = passwordHash;
    user.isEmailVerified = true;
    user.updatedAt = now;
  }

  await writeStore(store);

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, email: user.email }),
  };
}

export async function loginUser(email: string, password: string) {
  const store = await readStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return null;
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return null;
  }

  user.updatedAt = new Date().toISOString();
  await writeStore(store);

  return {
    user: sanitizeUser(user),
    token: signToken({ userId: user.id, email: user.email }),
  };
}

export async function updateUserProfileFromToken(
  token: string,
  profile: { firstName: string; lastName: string }
) {
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.id === payload.userId);
  if (!user) {
    return null;
  }

  user.firstName = profile.firstName.trim();
  user.lastName = profile.lastName.trim();
  user.updatedAt = new Date().toISOString();

  await writeStore(store);

  return sanitizeUser(user);
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.id === payload.userId);

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
}
