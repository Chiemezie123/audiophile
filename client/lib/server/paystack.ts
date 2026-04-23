type PaystackInitializeInput = {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  currency: string;
  metadata?: Record<string, unknown>;
};

type PaystackInitializeResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type PaystackVerifyResponse = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
};

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is required.");
  }

  return secretKey;
}

async function callPaystack<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result?.status) {
    throw new Error(result?.message || "Paystack request failed.");
  }

  return result.data as T;
}

export async function initializePaystackTransaction(
  input: PaystackInitializeInput
) {
  return callPaystack<PaystackInitializeResponse>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      reference: input.reference,
      callback_url: input.callbackUrl,
      currency: input.currency,
      metadata: input.metadata,
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return callPaystack<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}
