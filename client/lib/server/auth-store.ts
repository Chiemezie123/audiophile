import crypto from "node:crypto";

import { getDb, nowIso } from "./sqlite";

const OTP_TTL_MS = 10 * 60 * 1000;
const SECRET = process.env.AUTH_SECRET || "fuzzybeats-local-auth-secret";

export const SESSION_COOKIE_NAME = "fuzzybeats_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type StoredUserRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  auth_provider: string;
  is_email_verified: number;
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

function sanitizeUser(user: StoredUserRow) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    photo: user.photo || "",
    authProvider: user.auth_provider,
    isEmailVerified: Boolean(user.is_email_verified),
    role: user.role,
  };
}

export async function createOtpForEmail(email: string) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

  db.prepare(`DELETE FROM otp_codes WHERE email = ?`).run(normalizedEmail);
  db.prepare(
    `
      INSERT INTO otp_codes (email, code_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `
  ).run(normalizedEmail, digest(otp), Date.now() + OTP_TTL_MS, nowIso());

  return otp;
}

export async function verifyOtpForEmail(email: string, otp: string) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const otpRow = db
    .prepare(
      `
        SELECT id, code_hash, expires_at
        FROM otp_codes
        WHERE email = ? AND used_at IS NULL
        ORDER BY id DESC
        LIMIT 1
      `
    )
    .get(normalizedEmail) as
    | { id: number; code_hash: string; expires_at: number }
    | undefined;

  if (!otpRow) {
    return false;
  }

  const isValid =
    otpRow.expires_at > Date.now() && otpRow.code_hash === digest(otp);

  if (isValid) {
    db.prepare(`UPDATE otp_codes SET used_at = ? WHERE id = ?`).run(
      Date.now(),
      otpRow.id
    );
  }

  return isValid;
}

export async function createOrUpdatePasswordUser(email: string, password: string) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const now = nowIso();
  const existingUser = db
    .prepare(
      `
        SELECT id, email, first_name, last_name, photo, auth_provider, is_email_verified, role
        FROM users
        WHERE email = ?
        LIMIT 1
      `
    )
    .get(normalizedEmail) as StoredUserRow | undefined;

  if (!existingUser) {
    const userId = crypto.randomUUID();
    db.prepare(
      `
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, photo, auth_provider,
          is_email_verified, role, created_at, updated_at
        )
        VALUES (?, ?, ?, '', '', '', 'local', 1, 'user', ?, ?)
      `
    ).run(userId, normalizedEmail, passwordHash, now, now);

    const createdUser = db
      .prepare(
        `
          SELECT id, email, first_name, last_name, photo, auth_provider, is_email_verified, role
          FROM users
          WHERE id = ?
        `
      )
      .get(userId) as StoredUserRow;

    return {
      user: sanitizeUser(createdUser),
      token: signToken({ userId: createdUser.id, email: createdUser.email }),
    };
  }

  db.prepare(
    `
      UPDATE users
      SET password_hash = ?, auth_provider = 'local', is_email_verified = 1, updated_at = ?
      WHERE id = ?
    `
  ).run(passwordHash, now, existingUser.id);

  const updatedUser = db
    .prepare(
      `
        SELECT id, email, first_name, last_name, photo, auth_provider, is_email_verified, role
        FROM users
        WHERE id = ?
      `
    )
    .get(existingUser.id) as StoredUserRow;

  return {
    user: sanitizeUser(updatedUser),
    token: signToken({ userId: updatedUser.id, email: updatedUser.email }),
  };
}

export async function loginUser(email: string, password: string) {
  const db = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const userRow = db
    .prepare(
      `
        SELECT id, email, password_hash, first_name, last_name, photo, auth_provider, is_email_verified, role
        FROM users
        WHERE email = ?
        LIMIT 1
      `
    )
    .get(normalizedEmail) as
    | (StoredUserRow & { password_hash: string | null })
    | undefined;

  if (!userRow) {
    return null;
  }

  const validPassword = await verifyPassword(password, userRow.password_hash);
  if (!validPassword) {
    return null;
  }

  db.prepare(`UPDATE users SET updated_at = ? WHERE id = ?`).run(
    nowIso(),
    userRow.id
  );

  return {
    user: sanitizeUser(userRow),
    token: signToken({ userId: userRow.id, email: userRow.email }),
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

  const db = getDb();
  db.prepare(
    `
      UPDATE users
      SET first_name = ?, last_name = ?, updated_at = ?
      WHERE id = ?
    `
  ).run(profile.firstName.trim(), profile.lastName.trim(), nowIso(), payload.userId);

  const updatedUser = db
    .prepare(
      `
        SELECT id, email, first_name, last_name, photo, auth_provider, is_email_verified, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `
    )
    .get(payload.userId) as StoredUserRow | undefined;

  if (!updatedUser) {
    return null;
  }

  return sanitizeUser(updatedUser);
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const db = getDb();
  const user = db
    .prepare(
      `
        SELECT id, email, first_name, last_name, photo, auth_provider, is_email_verified, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `
    )
    .get(payload.userId) as StoredUserRow | undefined;

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
}
