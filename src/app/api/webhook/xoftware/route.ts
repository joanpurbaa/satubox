import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import {
  WEBHOOK_EVENTS_COLLECTION,
  finalizePaymentSuccessInTx,
} from "@/lib/payments";
import { xoftwareConfig } from "@/lib/xoftware";

// POST /api/webhook/xoftware
// Signature webhook: HMAC-SHA256(XOFFICE_WEBHOOK_SECRET, RAW_REQUEST_BODY) -> HEX,
// dibandingkan dengan header X-Signature secara timing-safe. STRICT, tanpa fallback.
interface WebhookBody {
  event_id?: string;
  order_id?: string;
  transaction_id?: string;
  channel_code?: string;
  status?: string;
  amount?: number;
  paid_at?: string;
  created_at?: string;
}

function hexToBuf(hex: string): Buffer {
  try {
    return Buffer.from(hex, "hex");
  } catch {
    return Buffer.alloc(0);
  }
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = hexToBuf(a);
  const bufB = hexToBuf(b);
  if (bufA.length === 0 || bufB.length === 0 || bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const cfg = xoftwareConfig();
  if (!cfg?.webhookSecret) {
    console.error("[api/webhook/xoftware] Webhook secret belum dikonfigurasi di server");
    return NextResponse.json({ error: "Server belum dikonfigurasi" }, { status: 503 });
  }

  // Wajib: baca raw body dulu SEBELUM json parse.
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const signature = req.headers.get("x-signature") ?? "";
  if (!signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expected = createHmac("sha256", cfg.webhookSecret).update(rawBody, "utf8").digest("hex");
  if (!safeEqualHex(expected, signature)) {
    return NextResponse.json({ error: "Signature tidak valid" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  const eventId =
    (req.headers.get("x-event-id") ?? "").trim() || (body.event_id ?? "").toString().trim();
  const eventType = req.headers.get("x-event-type") ?? "";
  const refId = (body.order_id ?? "").toString().trim();

  if (!eventId) {
    return NextResponse.json(
      { error: "Parameter event_id dibutuhkan" },
      { status: 400 },
    );
  }
  if (!refId) {
    return NextResponse.json({ error: "Parameter order_id dibutuhkan" }, { status: 400 });
  }

  const db = getDb();
  const evtRef = db.collection(WEBHOOK_EVENTS_COLLECTION).doc(eventId);
  const now = Date.now();

  let outcome = "unprocessed";
  let expiresAtMs: number | undefined;

  await db.runTransaction(async (t) => {
    const evtSnap = await t.get(evtRef);
    if (evtSnap.exists) {
      outcome = "duplicate";
      return;
    }

    const res = await finalizePaymentSuccessInTx(t, {
      refId,
      amount: typeof body.amount === "number" ? body.amount : undefined,
      transactionId: body.transaction_id,
      paidAt: body.paid_at ? Date.parse(body.paid_at) || undefined : undefined,
    });
    outcome = res.outcome;
    expiresAtMs = res.expiresAtMs;

    t.set(evtRef, {
      eventId,
      eventType,
      refId,
      webhookStatus: String(body.status ?? ""),
      amount: body.amount ?? null,
      outcome,
      processedAt: now,
    });
  });

  if (outcome === "ok") {
    console.log(`[api/webhook/xoftware] payment ${refId} SUCCESS -> subscription aktif`);
  } else if (outcome !== "duplicate") {
    console.warn(`[api/webhook/xoftware] event ${eventId} -> ${outcome} (refId=${refId})`);
  }

  return NextResponse.json({ ok: true, outcome, expiresAtMs: expiresAtMs ?? null });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}