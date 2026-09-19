import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getDb } from "@/lib/firebase";
import { CATALOG_COLLECTION, VALID_CATS, normalizeDomains } from "@/lib/catalog";

interface UpdateBody {
  name?: string;
  icon?: string;
  category?: string;
  cat?: string;
  domains?: string[];
  enabled?: boolean;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  const db = getDb();
  const ref = db.collection(CATALOG_COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
  }

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updatedAt: Date.now() };
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Nama aplikasi wajib diisi" }, { status: 400 });
    }
    patch.name = name;
  }
  if (typeof body.icon === "string") patch.icon = body.icon.trim();
  if (typeof body.category === "string") patch.category = body.category.trim();
  if (typeof body.cat === "string") {
    const raw = body.cat;
    patch.cat = VALID_CATS.includes(raw as (typeof VALID_CATS)[number]) ? raw : "LAINNYA";
  }
  if (body.domains !== undefined) {
    const domains = normalizeDomains(body.domains);
    if (domains.length === 0 && !patch.name) {
      return NextResponse.json({ error: "Minimal satu domain wajib diisi" }, { status: 400 });
    }
    patch.domains = domains;
  }
  if (typeof body.enabled === "boolean") patch.enabled = body.enabled;

  await ref.update(patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  const db = getDb();
  const ref = db.collection(CATALOG_COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Aplikasi tidak ditemukan" }, { status: 404 });
  }

  await ref.update({ enabled: false, updatedAt: Date.now() });
  return NextResponse.json({ ok: true });
}