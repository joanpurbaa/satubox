"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const proofs = [
	{
		file: "/bukti1.webp",
		w: 924,
		h: 274,
		alt: "Bukti chat pelanggan SatuBox yang berhasil aktivasi aplikasi premium",
	},
	{
		file: "/bukti2.webp",
		w: 918,
		h: 208,
		alt: "Screenshot konfirmasi transaksi langganan aplikasi premium SatuBox",
	},
	{
		file: "/bukti3.webp",
		w: 922,
		h: 456,
		alt: "Bukti order paket aplikasi premium mahasiswa SatuBox yang langsung aktif",
	},
	{
		file: "/bukti4.webp",
		w: 920,
		h: 294,
		alt: "Percakapan pelanggan dengan tim SatuBox soal aktivasi aplikasi premium",
	},
	{
		file: "/bukti5.webp",
		w: 918,
		h: 296,
		alt: "Bukti langsung dapat akses aplikasi premium setelah bayar SatuBox",
	},
];

export default function Testimonials() {
	const [active, setActive] = useState<number | null>(null);

	useEffect(() => {
		if (active === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(null);
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [active]);

	return (
		<section className="py-20 md:py-28">
			<div className="mx-auto max-w-6xl px-5 md:px-8">
				<div className="reveal">
					<span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
						04 · Testimoni &amp; Bukti
					</span>
					<h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
						Nggak cuma janji. Ini buktinya.
					</h2>
					<p className="mt-4 max-w-2xl text-lg text-text-secondary">
						Bukan cuma klaim marketing. Ini tangkapan layar dari pelanggan yang baru
						saja berlangganan SatuBox. Ketuk bukti untuk lihat jelas.
					</p>
				</div>

				<div className="reveal-stagger mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
					{proofs.map((p, i) => (
						<button
							key={p.file}
							type="button"
							onClick={() => setActive(i)}
							aria-label={`Perbesar ${p.alt}`}
							className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface text-left transition-all hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/10">
							<Image
								src={p.file}
								alt={p.alt}
								width={p.w}
								height={p.h}
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
							/>

							{/* Hover overlay */}
							<div className="pointer-events-none absolute inset-0 flex items-start justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 transition-opacity duration-300">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										aria-hidden="true">
										<circle
											cx="6.5"
											cy="6.5"
											r="4.5"
											stroke="currentColor"
											strokeWidth="1.5"
										/>
										<path
											d="M10 10l4 4"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
								</span>
							</div>

							{/* Badge */}
							<span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
								Bukti Nyata
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Lightbox */}
			{active !== null && (
				<div
					className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label={proofs[active].alt}
					onClick={() => setActive(null)}>
					<button
						type="button"
						onClick={() => setActive(null)}
						className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
						aria-label="Tutup tampilan yang diperbesar">
						<svg
							width="18"
							height="18"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true">
							<path
								d="M4 4l8 8M12 4l-8 8"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							/>
						</svg>
					</button>

					<div onClick={(e) => e.stopPropagation()}>
						<Image
							src={proofs[active].file}
							alt={proofs[active].alt}
							width={proofs[active].w * 5}
							height={proofs[active].h * 5}
							className="max-h-[85vh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
						/>
					</div>
				</div>
			)}
		</section>
	);
}
