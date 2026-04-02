import crypto from "node:crypto";

import { getDb, nowIso } from "./sqlite";

export type PersistedCartItem = {
  productSlug: string;
  quantity: number;
};

export type CreateOrderInput = {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  shippingAddress: string;
  shippingZipCode: string;
  shippingCity: string;
  shippingCountry: string;
  paymentMethod: string;
};

type OrderRow = {
  id: string;
  status: string;
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  shipping_address: string;
  shipping_zip_code: string;
  shipping_city: string;
  shipping_country: string;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  vat: number;
  grand_total: number;
  created_at: string;
};

function normalizeItems(items: PersistedCartItem[]) {
  const merged = new Map<string, number>();

  for (const item of items) {
    const productSlug = item.productSlug?.trim();
    const quantity = Number(item.quantity);

    if (!productSlug || !Number.isFinite(quantity) || quantity <= 0) {
      continue;
    }

    merged.set(productSlug, (merged.get(productSlug) || 0) + Math.floor(quantity));
  }

  return Array.from(merged.entries()).map(([productSlug, quantity]) => ({
    productSlug,
    quantity,
  }));
}





export async function getCartItemsForUser(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT product_slug as productSlug, quantity
        FROM cart_items
        WHERE user_id = ?
        ORDER BY created_at ASC
      `
    )
    .all(userId) as PersistedCartItem[];

  return rows;
}

export async function replaceCartItemsForUser(
  userId: string,
  items: PersistedCartItem[]
) {
  const db = getDb();
  const nextItems = normalizeItems(items);
  const timestamp = nowIso();
  const insertStatement = db.prepare(`
    INSERT INTO cart_items (user_id, product_slug, quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");

  try {
    db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);

    for (const item of nextItems) {
      insertStatement.run(
        userId,
        item.productSlug,
        item.quantity,
        timestamp,
        timestamp
      );
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return getCartItemsForUser(userId);
}

export async function mergeCartItemsForUser(
  userId: string,
  items: PersistedCartItem[]
) {
  const db = getDb();
  const nextItems = normalizeItems(items);
  const timestamp = nowIso();
  const statement = db.prepare(`
    INSERT INTO cart_items (user_id, product_slug, quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, product_slug) DO UPDATE SET
      quantity = cart_items.quantity + excluded.quantity,
      updated_at = excluded.updated_at
  `);

  db.exec("BEGIN");

  try {
    for (const item of nextItems) {
      statement.run(
        userId,
        item.productSlug,
        item.quantity,
        timestamp,
        timestamp
      );
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return getCartItemsForUser(userId);
}

export async function clearCartItemsForUser(userId: string) {
  const db = getDb();
  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);
}

export async function getWishlistItemsForUser(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT product_slug as productSlug, created_at as createdAt
        FROM wishlist_items
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
    )
    .all(userId) as Array<{ productSlug: string; createdAt: string }>;

  return rows;
}

export async function addWishlistItemForUser(userId: string, productSlug: string) {
  const db = getDb();
  db.prepare(
    `
      INSERT INTO wishlist_items (user_id, product_slug, created_at)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, product_slug) DO NOTHING
    `
  ).run(userId, productSlug, nowIso());

  return getWishlistItemsForUser(userId);
}

export async function removeWishlistItemForUser(
  userId: string,
  productSlug: string
) {
  const db = getDb();
  db.prepare(
    `
      DELETE FROM wishlist_items
      WHERE user_id = ? AND product_slug = ?
    `
  ).run(userId, productSlug);

  return getWishlistItemsForUser(userId);
}

export async function getOrdersForUser(userId: string) {
  const db = getDb();
  const orders = db
    .prepare(
      `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
    )
    .all(userId) as OrderRow[];

  const orderItemsStatement = db.prepare(`
    SELECT product_slug as productSlug, quantity, unit_price as unitPrice, line_total as lineTotal
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
  `);

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    billingName: order.billing_name,
    billingEmail: order.billing_email,
    billingPhone: order.billing_phone,
    shippingAddress: order.shipping_address,
    shippingZipCode: order.shipping_zip_code,
    shippingCity: order.shipping_city,
    shippingCountry: order.shipping_country,
    paymentMethod: order.payment_method,
    subtotal: order.subtotal,
    shippingFee: order.shipping_fee,
    vat: order.vat,
    grandTotal: order.grand_total,
    createdAt: order.created_at,
    items: orderItemsStatement.all(order.id),
  }));
}

export async function createOrderFromCartForUser(
  userId: string,
  input: CreateOrderInput
) {
  const db = getDb();
  const cartRows = db
    .prepare(
      `
        SELECT c.product_slug as productSlug, c.quantity, p.price
        FROM cart_items c
        INNER JOIN products p ON p.slug = c.product_slug
        WHERE c.user_id = ?
        ORDER BY c.id ASC
      `
    )
    .all(userId) as Array<{ productSlug: string; quantity: number; price: number }>;

  if (cartRows.length === 0) {
    return null;
  }

  const subtotal = cartRows.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const shippingFee = 50;
  const vat = Math.round(subtotal * 0.2);
  const grandTotal = subtotal + shippingFee;
  const orderId = `ord_${crypto.randomUUID()}`;
  const timestamp = nowIso();

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, user_id, status, billing_name, billing_email, billing_phone,
      shipping_address, shipping_zip_code, shipping_city, shipping_country,
      payment_method, subtotal, shipping_fee, vat, grand_total, created_at, updated_at
    )
    VALUES (?, ?, 'placed', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (
      order_id, product_slug, quantity, unit_price, line_total, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");

  try {
    insertOrder.run(
      orderId,
      userId,
      input.billingName,
      input.billingEmail,
      input.billingPhone,
      input.shippingAddress,
      input.shippingZipCode,
      input.shippingCity,
      input.shippingCountry,
      input.paymentMethod,
      subtotal,
      shippingFee,
      vat,
      grandTotal,
      timestamp,
      timestamp
    );

    for (const item of cartRows) {
      insertOrderItem.run(
        orderId,
        item.productSlug,
        item.quantity,
        item.price,
        item.quantity * item.price,
        timestamp
      );
    }

    db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const [createdOrder] = await getOrdersForUser(userId);
  return createdOrder;
}
