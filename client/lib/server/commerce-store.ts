import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";

import { getDb } from "./db";

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

type DbTransaction = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      orderBy: { id: "asc" };
      select: {
        productSlug: true;
        quantity: true;
        unitPrice: true;
        lineTotal: true;
      };
    };
  };
}>;

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

function mapOrder(order: OrderWithItems) {
  return {
    id: order.id,
    status: order.status,
    paymentReference: order.paymentReference,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    billingName: order.billingName,
    billingEmail: order.billingEmail,
    billingPhone: order.billingPhone,
    shippingAddress: order.shippingAddress,
    shippingZipCode: order.shippingZipCode,
    shippingCity: order.shippingCity,
    shippingCountry: order.shippingCountry,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    vat: order.vat,
    grandTotal: order.grandTotal,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productSlug: item.productSlug,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
  };
}

async function getCartSnapshotForUser(
  tx: DbTransaction | Awaited<ReturnType<typeof getDb>>,
  userId: string
) {
  return tx.cartItem.findMany({
    where: { userId },
    orderBy: { id: "asc" },
    include: {
      product: {
        select: {
          price: true,
        },
      },
    },
  });
}

function calculateOrderTotals(
  cartRows: Awaited<ReturnType<typeof getCartSnapshotForUser>>
) {
  const subtotal = cartRows.reduce(
    (sum: number, item: (typeof cartRows)[number]) => sum + item.quantity * item.product.price,
    0
  );
  const shippingFee = 50;
  const vat = Math.round(subtotal * 0.2);
  const grandTotal = subtotal + shippingFee;

  return {
    subtotal,
    shippingFee,
    vat,
    grandTotal,
  };
}

export async function getCartItemsForUser(userId: string) {
  const db = await getDb();
  const rows = await db.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      productSlug: true,
      quantity: true,
    },
  });

  return rows;
}

export async function replaceCartItemsForUser(
  userId: string,
  items: PersistedCartItem[]
) {
  const db = await getDb();
  const nextItems = normalizeItems(items);

  await db.$transaction(async (tx: DbTransaction) => {
    await tx.cartItem.deleteMany({
      where: { userId },
    });

    if (nextItems.length > 0) {
      await tx.cartItem.createMany({
        data: nextItems.map((item) => ({
          userId,
          productSlug: item.productSlug,
          quantity: item.quantity,
        })),
      });
    }
  });

  return getCartItemsForUser(userId);
}

export async function mergeCartItemsForUser(
  userId: string,
  items: PersistedCartItem[]
) {
  const db = await getDb();
  const nextItems = normalizeItems(items);

  await db.$transaction(async (tx: DbTransaction) => {
    for (const item of nextItems) {
      const existing = await tx.cartItem.findUnique({
        where: {
          userId_productSlug: {
            userId,
            productSlug: item.productSlug,
          },
        },
      });

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + item.quantity,
          },
        });
        continue;
      }

      await tx.cartItem.create({
        data: {
          userId,
          productSlug: item.productSlug,
          quantity: item.quantity,
        },
      });
    }
  });

  return getCartItemsForUser(userId);
}

export async function clearCartItemsForUser(userId: string) {
  const db = await getDb();
  await db.cartItem.deleteMany({
    where: { userId },
  });
}

export async function getWishlistItemsForUser(userId: string) {
  const db = await getDb();
  const rows = await db.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      productSlug: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    productSlug: row.productSlug,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function addWishlistItemForUser(userId: string, productSlug: string) {
  const db = await getDb();
  await db.wishlistItem.upsert({
    where: {
      userId_productSlug: {
        userId,
        productSlug,
      },
    },
    update: {},
    create: {
      userId,
      productSlug,
    },
  });

  return getWishlistItemsForUser(userId);
}

export async function removeWishlistItemForUser(
  userId: string,
  productSlug: string
) {
  const db = await getDb();
  await db.wishlistItem.deleteMany({
    where: {
      userId,
      productSlug,
    },
  });

  return getWishlistItemsForUser(userId);
}

export async function getOrdersForUser(userId: string) {
  const db = await getDb();
  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { id: "asc" },
        select: {
          productSlug: true,
          quantity: true,
          unitPrice: true,
          lineTotal: true,
        },
      },
    },
  });

  return orders.map(mapOrder);
}

export async function getOrderByPaymentReference(paymentReference: string) {
  const db = await getDb();
  const order = await db.order.findUnique({
    where: { paymentReference },
    include: {
      items: {
        orderBy: { id: "asc" },
        select: {
          productSlug: true,
          quantity: true,
          unitPrice: true,
          lineTotal: true,
        },
      },
    },
  });

  return order ? mapOrder(order) : null;
}

export async function createOrderFromCartForUser(
  userId: string,
  input: CreateOrderInput
) {
  const db = await getDb();
  const cartRows = await getCartSnapshotForUser(db, userId);

  if (cartRows.length === 0) {
    return null;
  }

  const { subtotal, shippingFee, vat, grandTotal } = calculateOrderTotals(cartRows);
  const orderId = `ord_${crypto.randomUUID()}`;

  await db.$transaction(async (tx: DbTransaction) => {
    await tx.order.create({
      data: {
        id: orderId,
        userId,
        status: "placed",
        paymentReference: null,
        billingName: input.billingName,
        billingEmail: input.billingEmail,
        billingPhone: input.billingPhone,
        shippingAddress: input.shippingAddress,
        shippingZipCode: input.shippingZipCode,
        shippingCity: input.shippingCity,
        shippingCountry: input.shippingCountry,
        paymentMethod: input.paymentMethod,
        subtotal,
        shippingFee,
        vat,
        grandTotal,
      },
    });

    if (cartRows.length > 0) {
      await tx.orderItem.createMany({
        data: cartRows.map((item) => ({
          orderId,
          productSlug: item.productSlug,
          quantity: item.quantity,
          unitPrice: item.product.price,
          lineTotal: item.quantity * item.product.price,
        })),
      });
    }

    await tx.cartItem.deleteMany({
      where: { userId },
    });
  });

  const [createdOrder] = await getOrdersForUser(userId);
  return createdOrder;
}

export async function createPendingPaystackOrderFromCartForUser(
  userId: string,
  input: CreateOrderInput,
  paymentReference: string
) {
  const db = await getDb();
  const cartRows = await getCartSnapshotForUser(db, userId);

  if (cartRows.length === 0) {
    return null;
  }

  const { subtotal, shippingFee, vat, grandTotal } = calculateOrderTotals(cartRows);
  const orderId = `ord_${crypto.randomUUID()}`;

  await db.$transaction(async (tx: DbTransaction) => {
    await tx.order.create({
      data: {
        id: orderId,
        userId,
        status: "pending-payment",
        paymentReference,
        billingName: input.billingName,
        billingEmail: input.billingEmail,
        billingPhone: input.billingPhone,
        shippingAddress: input.shippingAddress,
        shippingZipCode: input.shippingZipCode,
        shippingCity: input.shippingCity,
        shippingCountry: input.shippingCountry,
        paymentMethod: "paystack",
        subtotal,
        shippingFee,
        vat,
        grandTotal,
      },
    });

    await tx.orderItem.createMany({
      data: cartRows.map((item) => ({
        orderId,
        productSlug: item.productSlug,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.quantity * item.product.price,
      })),
    });
  });

  return getOrderByPaymentReference(paymentReference);
}

export async function markOrderAsPaidByReference(paymentReference: string) {
  const db = await getDb();

  const updatedOrder = await db.$transaction(async (tx: DbTransaction) => {
    const existingOrder = await tx.order.findUnique({
      where: { paymentReference },
      include: {
        items: {
          orderBy: { id: "asc" },
          select: {
            productSlug: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return null;
    }

    if (existingOrder.status !== "paid") {
      await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          status: "paid",
          paidAt: new Date(),
        },
      });

      await tx.cartItem.deleteMany({
        where: { userId: existingOrder.userId },
      });
    }

    return tx.order.findUnique({
      where: { id: existingOrder.id },
      include: {
        items: {
          orderBy: { id: "asc" },
          select: {
            productSlug: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
          },
        },
      },
    });
  });

  return updatedOrder ? mapOrder(updatedOrder) : null;
}

export async function deletePendingOrderByPaymentReference(paymentReference: string) {
  const db = await getDb();
  await db.order.deleteMany({
    where: {
      paymentReference,
      status: "pending-payment",
    },
  });
}
