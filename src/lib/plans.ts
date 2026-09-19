export type PlanUnit = "month" | "minute";

// Ganti menjadi "month" saat masuk produksi (1/3/6 bulan).
// Lokal/testing pakai "minute" (3/5/10 menit) untuk menguji fitur expired.
export const PLAN_UNIT: PlanUnit = "minute";

export interface Plan {
  id: string;
  duration: number;
  label: string;
  amount: number;
  framing: string;
  highlighted?: boolean;
  badge?: string;
  effective: string;
}

const minutePlans: Plan[] = [
  {
    id: "3m",
    duration: 3,
    label: "3 Menit",
    amount: 39000,
    framing: "Buat yang mau coba dulu",
    effective: "Rp39.000 · mode tes",
  },
  {
    id: "5m",
    duration: 5,
    label: "5 Menit",
    amount: 99000,
    framing: "Paling banyak dipilih",
    highlighted: true,
    badge: "Paling Dipilih",
    effective: "Rp99.000 · mode tes",
  },
  {
    id: "10m",
    duration: 10,
    label: "10 Menit",
    amount: 179000,
    framing: "Coba paling lama",
    effective: "Rp179.000 · mode tes",
  },
];

const monthPlans: Plan[] = [
  {
    id: "1m",
    duration: 1,
    label: "1 Bulan",
    amount: 39000,
    framing: "Buat yang mau cobain dulu",
    effective: "Rp39.000/bulan",
  },
  {
    id: "3m",
    duration: 3,
    label: "3 Bulan",
    amount: 99000,
    framing: "Paling banyak dipilih mahasiswa",
    highlighted: true,
    badge: "Paling Dipilih",
    effective: "Rp33.000/bulan",
  },
  {
    id: "6m",
    duration: 6,
    label: "6 Bulan",
    amount: 179000,
    framing: "Makin lama, makin hemat",
    effective: "Rp29.000/bulan",
  },
];

export const PLANS: Plan[] = PLAN_UNIT === "minute" ? minutePlans : monthPlans;

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export const PLAN_UNIT_LABEL: string = PLAN_UNIT === "minute" ? "menit" : "bulan";

export function expiryFromNow(plan: Plan, fromMs = Date.now()): number {
  if (PLAN_UNIT === "minute") {
    return fromMs + plan.duration * 60 * 1000;
  }
  const d = new Date(fromMs);
  d.setMonth(d.getMonth() + plan.duration);
  return d.getTime();
}

export function getRemainingParts(expiresAtMs: number, nowMs: number = Date.now()) {
  const ms = Math.max(0, expiresAtMs - nowMs);
  if (PLAN_UNIT === "month") {
    return { expired: ms === 0 && expiresAtMs <= nowMs, days: Math.ceil(ms / 86400000) };
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { expired: expiresAtMs <= nowMs, minutes, seconds, ms };
}

export function remainingText(expiresAtMs: number, nowMs: number = Date.now()): string {
  if (Plan_isExpired(expiresAtMs, nowMs)) return "kedaluwarsa";
  if (PLAN_UNIT === "month") {
    const { days } = getRemainingParts(expiresAtMs, nowMs);
    return `${days} hari`;
  }
  const { minutes, seconds } = getRemainingParts(expiresAtMs, nowMs);
  return `${minutes} menit ${seconds} detik`;
}

export function Plan_isExpired(expiresAtMs: number, nowMs: number = Date.now()): boolean {
  return expiresAtMs <= nowMs;
}

export function formatExpiryDate(expiresAtMs: number): string {
  return new Date(expiresAtMs).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}