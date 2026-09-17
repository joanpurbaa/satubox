export type PlanMonths = 1 | 3 | 6;

export interface Plan {
  months: PlanMonths;
  amount: number;
  label: string;
  perMonth: string;
}

export const plans: Record<PlanMonths, Plan> = {
  1: {
    months: 1,
    amount: 39000,
    label: "1 Bulan",
    perMonth: "Rp39.000/bulan",
  },
  3: {
    months: 3,
    amount: 99000,
    label: "3 Bulan",
    perMonth: "Rp33.000/bulan",
  },
  6: {
    months: 6,
    amount: 179000,
    label: "6 Bulan",
    perMonth: "Rp29.000/bulan",
  },
};

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}