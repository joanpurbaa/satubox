import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getDb } from "@/lib/firebase";
import {
  CATALOG_COLLECTION,
  VALID_CATS,
  normalizeDomains,
  slugify,
} from "@/lib/catalog";

interface CreateBody {
  name?: string;
  icon?: string;
  category?: string;
  cat?: string;
  domains?: string[];
}

export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Nama aplikasi wajib diisi" }, { status: 400 });
  }
  const domains = normalizeDomains(body.domains);
  if (domains.length === 0) {
    return NextResponse.json({ error: "Minimal satu domain wajib diisi" }, { status: 400 });
  }
  const catRaw = String(body.cat || "LAINNYA");
  const cat = VALID_CATS.includes(catRaw as (typeof VALID_CATS)[number])
    ? catRaw
    : "LAINNYA";

  const id = slugify(name);
  const db = getDb();
  const ref = db.collection(CATALOG_COLLECTION).doc(id);
  const existing = await ref.get();
  if (existing.exists) {
    return NextResponse.json(
      { error: "Aplikasi dengan nama tersebut sudah ada di katalog" },
      { status: 409 }
    );
  }

  const now = Date.now();
  await ref.set({
    name,
    icon: String(body.icon || "").trim(),
    category: String(body.category || "Lainnya").trim(),
    cat,
    domains,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true, id });
}