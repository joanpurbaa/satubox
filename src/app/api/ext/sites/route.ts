import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase";
import { verifySessionToken, corsJson, corsHeaders } from "@/lib/ext-api";

const LEGACY_SYNC_KEY = "STFoEzG0uY_Ixow0Pqr9h-Lp1cr7Z2A1C-fdpljFqys";

async function migrateLegacyIfEmpty(sitesRef: FirebaseFirestore.CollectionReference, legacyRef: FirebaseFirestore.CollectionReference) {
  const mine = await sitesRef.limit(1).get();
  if (!mine.empty) return;

  const legacy = await legacyRef.get();
  if (legacy.empty) return;

  const db = sitesRef.firestore;
  const batch = db.batch();
  const now = Timestamp.now();
  for (const d of legacy.docs) {
    const data = d.data();
    batch.set(
      sitesRef.doc(d.id),
      {
        domain: data.domain ?? d.id,
        name: data.name ?? data.domain ?? d.id,
        cookies: Array.isArray(data.cookies) ? data.cookies : [],
        createdAt: data.createdAt ?? now,
        updatedAt: data.updatedAt ?? now,
      },
      { merge: true },
    );
  }
  await batch.commit();
}

interface SitePayload {
  domain?: string;
  name?: string;
  cookies?: unknown[];
}

interface SitesBody {
  idToken?: string;
  action?: string;
  site?: SitePayload;
  domain?: string;
}

export async function POST(req: Request) {
  let body: SitesBody;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Request tidak valid" }, 400);
  }

  const auth = await verifySessionToken(body.idToken);
  if ("error" in auth) {
    return corsJson({ error: auth.error }, auth.status);
  }

  const db = getDb();
  const sitesRef = db.collection("users").doc(auth.uid).collection("sites");
  const legacyRef = db.collection("lockers").doc(LEGACY_SYNC_KEY).collection("sites");
  const action = body.action ?? "";

  if (action === "list") {
    await migrateLegacyIfEmpty(sitesRef, legacyRef);
    const snap = await sitesRef.get();
    const sites = snap.docs.map((d) => {
      const data = d.data();
      const toMs = (v: unknown) => (v instanceof Timestamp ? v.toMillis() : undefined);
      return {
        id: d.id,
        domain: data.domain ?? d.id,
        name: data.name ?? data.domain ?? d.id,
        cookies: data.cookies ?? [],
        createdAtMs: toMs(data.createdAt),
        updatedAtMs: toMs(data.updatedAt),
      };
    });
    return corsJson({ ok: true, sites });
  }

  if (action === "put") {
    await migrateLegacyIfEmpty(sitesRef, legacyRef);
    const site = body.site;
    const domain = (site?.domain ?? "").trim();
    if (!domain) {
      return corsJson({ error: "Domain wajib diisi" }, 400);
    }
    if (!Array.isArray(site?.cookies)) {
      return corsJson({ error: "Data cookie tidak valid" }, 400);
    }

    const docRef = sitesRef.doc(domain);
    const existing = await docRef.get();
    const now = Timestamp.now();
    await docRef.set({
      domain,
      name: (site?.name ?? "").trim() || domain,
      cookies: site!.cookies,
      createdAt: existing.exists ? (existing.data()?.createdAt ?? now) : now,
      updatedAt: now,
    });
    return corsJson({ ok: true, domain });
  }

  if (action === "delete") {
    const domain = (body.domain ?? "").trim();
    if (!domain) {
      return corsJson({ error: "Domain wajib diisi" }, 400);
    }
    await sitesRef.doc(domain).delete();
    return corsJson({ ok: true, domain });
  }

  return corsJson({ error: "Aksi tidak dikenal" }, 400);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}