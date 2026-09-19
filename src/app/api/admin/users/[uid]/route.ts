import { NextResponse } from "next/server";
import { getDb, getAuthAdmin } from "@/lib/firebase";
import { getAdminUser } from "@/lib/admin";

// DELETE /api/admin/users/[uid]
// Hapus user secara permanen (akun auth + data Firestore terkait).
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  const { uid } = await params;
  if (uid === admin.uid) {
    return NextResponse.json(
      { error: "Tidak bisa menghapus akun admin sendiri" },
      { status: 400 },
    );
  }

  const db = getDb();
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }
  const data = doc.data()!;

  // 1. Sites subcollection.
  const sites = await userRef.collection("sites").listDocuments();
  await Promise.all(sites.map((s) => s.delete()));

  // 2. Reverse-lookup username.
  const username = String(data.username || "");
  if (username) {
    const usernameKey = username.toLowerCase();
    const unRef = db.collection("usernames").doc(usernameKey);
    const unDoc = await unRef.get();
    if (unDoc.exists) await unRef.delete();
  }

  // 3. Payment records milik user.
  const paySnap = await db.collection("payments").where("uid", "==", uid).get();
  await Promise.all(paySnap.docs.map((p) => p.ref.delete()));

  // 4. Akun Firebase Auth. Jangan gagalkan hapus data jika akun auth sudah tidak ada.
  try {
    await getAuthAdmin().deleteUser(uid);
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    if (code !== "auth/user-not-found") {
      console.error("[api/admin/users] deleteUser gagal:", (err as Error)?.message ?? err);
    }
  }

  // 5. Dokumen user terakhir.
  await userRef.delete();

  return NextResponse.json({ ok: true });
}