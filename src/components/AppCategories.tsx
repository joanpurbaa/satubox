"use client";

import { useState, type CSSProperties } from "react";
import AppLogo from "./AppLogo";
import { apps, categories } from "@/lib/apps";

const PREVIEW_COUNT = 15;

export default function AppCategories() {
	const [active, setActive] = useState<"Semua" | (typeof categories)[number]>(
		"Semua",
	);
	const [showAll, setShowAll] = useState(false);

	const filtered =
		active === "Semua" ? apps : apps.filter((a) => a.category === active);
	const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);
	const hasMore = filtered.length > PREVIEW_COUNT;

	return (
		<section className="relative py-20 md:py-28" id="aplikasi">
			<div
				className="bg-grid bg-grid-lg-align"
				style={{ "--grid-col": "220.8px" } as CSSProperties}
				aria-hidden="true"
			/>
			<div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
				<div className="reveal">
					<span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
						02 · Daftar Aplikasi
					</span>
					<h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
						Ini 30 aplikasi premium untuk kuliah &amp; harimu
					</h2>
					<p className="mt-4 text-lg text-text-secondary">
						{apps.length} aplikasi premium untuk ngerjain tugas, naikin
						produktivitas, dan hiburan. Nggak semua aplikasi perlu, tapi ini yang
						paling sering kamu butuh.
					</p>
				</div>

				<div className="reveal-stagger mt-10 flex flex-wrap items-center justify-center gap-2">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => {
								setActive(cat);
								setShowAll(false);
							}}
							className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
								active === cat
									? "bg-brand-500 text-white shadow-sm"
									: "bg-surface-dim text-text-secondary hover:border-brand-500/40 hover:text-text-primary"
							}`}
							aria-pressed={active === cat}>
							{cat}
						</button>
					))}
				</div>

				<div className="reveal-stagger relative">
<div className="mt-10 grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
					{visible.map((app) => (
						<div
							key={app.name}
							className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-2.5 text-center transition-all hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10 sm:gap-3 sm:rounded-2xl sm:p-5">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-125 group-hover:ring-brand-500/40 group-hover:rotate-6 sm:h-20 sm:w-20 sm:rounded-2xl">
								<AppLogo
									src={app.src}
									name={app.name}
									className="h-10 w-10 rounded-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16 sm:rounded-xl"
								/>
							</div>
							<span className="text-xs font-semibold text-text-primary sm:text-sm">
								{app.name}
							</span>
						</div>
					))}
				</div>

					{!showAll && hasMore && (
						<div
							className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#090812] via-[#090812]/60 to-transparent md:h-44"
							aria-hidden="true"
						/>
					)}
				</div>

				{hasMore && (
					<div className="mt-10 flex justify-center">
						<button
							onClick={() => setShowAll((v) => !v)}
							className="group inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-surface px-7 py-3 text-sm font-semibold text-brand-300 transition-all hover:border-brand-400 hover:bg-brand-500/[0.08] hover:text-white active:scale-[0.97]">
							{showAll ? "Tutup" : "Lihat semua"}
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								aria-hidden="true"
								className={`transition-transform duration-300 ${
									showAll ? "rotate-180" : ""
								}`}>
								<path
									d="M4 6l4 4 4-4"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
