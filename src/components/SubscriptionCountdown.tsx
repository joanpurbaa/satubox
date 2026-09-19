"use client";

import { useEffect, useState } from "react";

export default function SubscriptionCountdown({
  expiresAtMs,
  unit = "minute",
}: {
  expiresAtMs: number;
  unit?: "minute" | "month";
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = Math.max(0, expiresAtMs - now);
  const expired = expiresAtMs <= now;

  if (unit === "month") {
    const days = Math.ceil((expiresAtMs - now) / 86400000);
    return (
      <span className={expired ? "text-red-400" : "tabular-nums text-brand-300"}>
        {expired ? "kedaluwarsa" : `${days} hari`}
      </span>
    );
  }

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return (
    <span className={expired ? "text-red-400" : "tabular-nums text-brand-300"}>
      {expired ? "kedaluwarsa" : `${minutes} menit ${seconds} detik`}
    </span>
  );
}