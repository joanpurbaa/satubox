import { createHmac } from "crypto";

// Server-side Xoftware Pay client.
// Jangan pernah import file ini dari kode client ("use client") / NEXT_PUBLIC_*.

export const XOF_MERCHANT_ID = "XOFFICE_MERCHANT_ID";
export const XOF_API_KEY = "XOFFICE_API_KEY";
export const XOF_WEBHOOK_SECRET = "XOFFICE_WEBHOOK_SECRET";
export const XOF_BASE_URL = "XOFFICE_BASE_URL";

export const XOF_DEFAULT_BASE_URL = "https://payment.xoftware.id/v1/api";

export interface XofConfig {
  merchantId: string;
  apiKey: string;
  webhookSecret: string;
  baseUrl: string;
}

export function xoftwareConfig(): XofConfig | null {
  const merchantId = process.env[XOF_MERCHANT_ID]?.trim() ?? "";
  const apiKey = process.env[XOF_API_KEY]?.trim() ?? "";
  const webhookSecret = process.env[XOF_WEBHOOK_SECRET]?.trim() ?? "";
  const baseUrl = (process.env[XOF_BASE_URL]?.trim() || XOF_DEFAULT_BASE_URL).replace(/\/+$/, "");
  if (!merchantId || !apiKey || !webhookSecret) return null;
  return { merchantId, apiKey, webhookSecret, baseUrl };
}

export function xoftwareConfigured(): boolean {
  return xoftwareConfig() !== null;
}

export function requireXoftwareConfig(): XofConfig {
  const cfg = xoftwareConfig();
  if (!cfg) {
    throw new Error(
      `Xoftware Pay belum dikonfigurasi. Set ${XOF_MERCHANT_ID}, ${XOF_API_KEY}, ${XOF_WEBHOOK_SECRET} (dan opsional ${XOF_BASE_URL}) di environment server.`,
    );
  }
  return cfg;
}

// --- Signature ---
// Signature message: TIMESTAMP + "\n" + HTTP_METHOD + "\n" + REQUEST_PATH + "\n" + RAW_JSON_BODY
// HMAC-SHA256 dengan X-API-Key sebagai secret, output Base64.
export function signRequest(
  apiKey: string,
  timestamp: string,
  method: string,
  requestPath: string,
  rawBody: string,
): string {
  const message = [timestamp, method, requestPath, rawBody].join("\n");
  return createHmac("sha256", apiKey).update(message, "utf8").digest("base64");
}

export interface CreateTransactionPayload {
  merchant_id: number;
  channel_code: string;
  amount: number;
  ref_id: string;
  fee_direction: string;
  notify_url: string;
  return_url: string;
  expires_in_minutes: number;
  note: string;
  metadata: {
    customer: { id: string; name: string; email: string };
    products: { product_code: string; product_name: string }[];
  };
}

export interface XofTransactionResult {
  transaction_id: string;
  qris_text?: string;
  url?: string;
  code?: string;
  expires_at?: string;
  status?: string;
  payment_status?: string;
  channel_code?: string;
}

interface XofApiError {
  ok?: boolean;
  error?: boolean | string;
  message?: string;
}

// Respon Xoftware dibungkus: {"code":201,"data":{...}} untuk sukses, {"code":4xx,"error":true,"message":"..."} untuk error.
function unwrapXof(data: unknown): unknown {
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    typeof (data as { data: unknown }).data === "object" &&
    (data as { data: unknown }).data !== null &&
    "code" in data
  ) {
    return (data as { data: unknown }).data;
  }
  return data;
}

async function xofFetch(
  cfg: XofConfig,
  url: string,
  body: Record<string, unknown>,
): Promise<XofTransactionResult> {
  const rawBody = JSON.stringify(body);
  const requestPath = new URL(url).pathname;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signRequest(cfg.apiKey, timestamp, "POST", requestPath, rawBody);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": cfg.apiKey,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
      },
      body: rawBody,
      cache: "no-store",
    });
  } catch (err) {
    const msg = (err as Error)?.message ?? "network error";
    throw new Error(`Xoftware: gagal terhubung ke payment gateway (${msg})`);
  }

  let parsed: unknown = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  const errShape = parsed as XofApiError | null;
  const code = (parsed as { code?: unknown } | null)?.code;
  const isError =
    !res.ok ||
    errShape?.error === true ||
    (typeof code === "number" && code >= 400);
  if (isError) {
    const detail =
      errShape?.message || errShape?.error || `HTTP ${res.status}`;
    throw new Error(`Xoftware: ${detail}`);
  }
  if (!parsed) {
    throw new Error("Xoftware: respon tidak valid (bukan JSON)");
  }

  const inner = unwrapXof(parsed) as XofTransactionResult;
  if (!inner.transaction_id) {
    throw new Error("Xoftware: respon create transaction tidak memiliki transaction_id");
  }
  return inner;
}

// POST /v1/api/transactions
export async function createTransaction(
  payload: CreateTransactionPayload,
): Promise<XofTransactionResult> {
  const cfg = requireXoftwareConfig();
  const url = `${cfg.baseUrl}/transactions`;
  return xofFetch(cfg, url, payload as unknown as Record<string, unknown>);
}

// POST /v1/api/transactions/status  ({ "ref_id": "..." })
export async function getTransactionStatus(refId: string): Promise<{
  ref_id?: string;
  transaction_id?: string;
  status?: string;
  payment_status?: string;
  amount?: number;
  channel_code?: string;
  paid_at?: string;
  created_at?: string;
}> {
  const cfg = requireXoftwareConfig();
  const url = `${cfg.baseUrl}/transactions/status`;
  return (await xofFetch(cfg, url, { ref_id: refId })) as Awaited<
    ReturnType<typeof getTransactionStatus>
  >;
}

// POST /v1/api/transactions/cancel  ({ "ref_id": "..." })
// Catatan: path endpoint cancel belum terkonfirmasi di dokumentasi; disesuaikan dengan pola /transactions/status.
export async function cancelTransaction(refId: string): Promise<XofTransactionResult> {
  const cfg = requireXoftwareConfig();
  const url = `${cfg.baseUrl}/transactions/cancel`;
  return xofFetch(cfg, url, { ref_id: refId });
}