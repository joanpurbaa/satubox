import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Masuk · SatuBox",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string; paid?: string }>;
}) {
  const params = await searchParams;

  // Datang dari pembayaran daftar: jika sudah login (auto-login saat daftar),
  // langsung lanjut ke dashboard + panduan instalasi.
  if (params.paid === "1") {
    const user = await getSessionUser();
    if (user) redirect("/dashboard");
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <LoginForm paid next="/dashboard" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <LoginForm registered={params.registered === "1"} next={params.next} />
    </main>
  );
}