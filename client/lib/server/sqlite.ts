import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

import { categorySeed, productSeed } from "./product-seed";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "fuzzybeats.sqlite");

let database: DatabaseSync | null = null;

function seedReferenceData(db: DatabaseSync) {
  const insertCategory = db.prepare(`
    INSERT INTO categories (slug, name)
    VALUES (?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (slug, category_slug, name, short_name, price)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      category_slug = excluded.category_slug,
      name = excluded.name,
      short_name = excluded.short_name,
      price = excluded.price
  `);

  for (const category of categorySeed) {
    insertCategory.run(category.slug, category.name);
  }

  for (const product of productSeed) {
    insertProduct.run(
      product.slug,
      product.categorySlug,
      product.name,
      product.shortName,
      product.price
    );
  }
}

function initializeDatabase(db: DatabaseSync) {
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      photo TEXT NOT NULL DEFAULT '',
      auth_provider TEXT NOT NULL DEFAULT 'local',
      is_email_verified INTEGER NOT NULL DEFAULT 0,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(provider, provider_account_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used_at INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      category_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, product_slug),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, product_slug),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'placed',
      billing_name TEXT NOT NULL,
      billing_email TEXT NOT NULL,
      billing_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_zip_code TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_country TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER NOT NULL,
      vat INTEGER NOT NULL,
      grand_total INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price INTEGER NOT NULL,
      line_total INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
    CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
  `);

  seedReferenceData(db);
}

export function getDb() {
  if (database) {
    return database;
  }

  mkdirSync(DATA_DIR, { recursive: true });
  database = new DatabaseSync(DB_FILE);
  initializeDatabase(database);
  return database;
}

export function nowIso() {
  return new Date().toISOString();
}
