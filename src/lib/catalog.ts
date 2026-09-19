import { apps, type ExtCat } from "./apps";
import { getDb } from "./firebase";

export const CATALOG_COLLECTION = "catalog_apps";

export interface CatalogApp {
  id: string;
  name: string;
  icon: string;
  category: string;
  cat: ExtCat;
  domains: string[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export const VALID_CATS: ExtCat[] = [
  "STREAMING",
  "MUSIK",
  "KREATIF",
  "PRODUKTIVITAS",
  "PENDIDIKAN",
  "LAINNYA",
];

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "app"
  );
}

export function normalizeDomains(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const set = new Set<string>();
  for (const d of raw) {
    const v = String(d || "")
      .trim()
      .toLowerCase()
      .replace(/^\.+/, "");
    if (v) set.add(v);
  }
  return [...set];
}

function fromDoc(id: string, d: Record<string, unknown>): CatalogApp {
  const cat = String(d.cat || "LAINNYA");
  return {
    id,
    name: String(d.name || id),
    icon: String(d.icon || ""),
    category: String(d.category || "Lainnya"),
    cat: (VALID_CATS.includes(cat as ExtCat) ? cat : "LAINNYA") as ExtCat,
    domains: normalizeDomains(d.domains),
    enabled: d.enabled !== false,
    createdAt: Number(d.createdAt) || 0,
    updatedAt: Number(d.updatedAt) || 0,
  };
}

export async function listCatalog(): Promise<CatalogApp[]> {
  const snap = await getDb().collection(CATALOG_COLLECTION).get();
  return snap.docs.map((d) => fromDoc(d.id, d.data() as Record<string, unknown>));
}

export async function ensureCatalogSeeded(): Promise<CatalogApp[]> {
  const db = getDb();
  const col = db.collection(CATALOG_COLLECTION);
  const snap = await col.get();
  if (!snap.empty) {
    return snap.docs.map((d) => fromDoc(d.id, d.data() as Record<string, unknown>));
  }
  const now = Date.now();
  for (const a of apps) {
    await col.doc(slugify(a.name)).set({
      name: a.name,
      icon: a.src,
      category: a.category,
      cat: a.cat,
      domains: normalizeDomains(a.domains),
      enabled: true,
      createdAt: now,
      updatedAt: now,
    });
  }
  const seeded = await col.get();
  return seeded.docs.map((d) => fromDoc(d.id, d.data() as Record<string, unknown>));
}