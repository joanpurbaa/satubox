import { getDb } from "@/lib/firebase";
import { verifySessionToken, corsJson, corsHeaders } from "@/lib/ext-api";

interface ProfileBody {
  idToken?: string;
}

export async function POST(req: Request) {
  let body: ProfileBody;
  try {
    body = await req.json();
  } catch {
    return corsJson({ error: "Request tidak valid" }, 400);
  }

  const auth = await verifySessionToken(body.idToken);
  if ("error" in auth) {
    return corsJson({ error: auth.error }, auth.status);
  }

  const doc = await getDb().collection("users").doc(auth.uid).get();
  if (!doc.exists) {
    return corsJson({ error: "Akun belum terdaftar di SatuBox" }, 404);
  }

  const p = doc.data()!;
  return corsJson({
    ok: true,
    profile: {
      username: p.username ?? "",
      email: p.email ?? auth.email,
      planId: p.planId ?? "",
      planLabel: p.planLabel ?? "",
      expiresAtMs: p.expiresAtMs ?? 0,
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}