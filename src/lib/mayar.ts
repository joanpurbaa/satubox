const MAYAR_BASE_URL =
  process.env.MAYAR_BASE_URL ?? "https://api.mayar.io"; // sandbox (prod: https://api.mayar.id)

export function getMayarApiKey(): string {
  const key = process.env.MAYAR_API_KEY;
  if (!key) {
    throw new Error(
      "MAYAR_API_KEY belum diatur. Set di .env.local (sandbox: buat di web.mayar.io).",
    );
  }
  return key;
}

export interface MayarCreatePayment {
  name: string;
  email: string;
  mobile?: string;
  amount: number;
  description: string;
  months: number;
}

export interface MayarPaymentResult {
  paymentId: string;
  transactionId: string;
  link: string;
}

export async function createPaymentRequest(
  input: MayarCreatePayment,
): Promise<MayarPaymentResult> {
  const res = await fetch(`${MAYAR_BASE_URL}/hl/v2/payments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMayarApiKey()}`,
    },
    body: JSON.stringify({
      name: input.name,
      amount: input.amount,
      email: input.email,
      mobile: input.mobile,
      description: input.description,
      expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      extraData: {
        planMonths: input.months,
        source: "satubox-landing",
      },
    }),
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => null)) as {
    statusCode?: number;
    messages?: string;
    data?: { id?: string; transactionId?: string; link?: string };
  } | null;

  if (!res.ok || !payload?.data?.link) {
    throw new Error(
      `Mayar create payment gagal (${res.status}): ${payload?.messages ?? res.statusText}`,
    );
  }

  return {
    paymentId: payload.data.id!,
    transactionId: payload.data.transactionId!,
    link: payload.data.link,
  };
}