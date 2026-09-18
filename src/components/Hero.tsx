import Image from "next/image";

const floatingCards = [
	{
		label: "30 app premium",
		sub: "semua dalam satu paket",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="none"
				aria-hidden="true">
				<circle cx="10" cy="10" r="9" fill="#7c5cff" />
				<path
					d="M6 10.5l2.5 2.5L14 7.5"
					stroke="#fff"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		pos: "absolute -left-2 top-2 z-20 sm:-left-8 md:-left-12 lg:-left-14",
		delay: "0s",
		duration: "5.5s",
	},
	{
		label: "Mulai Rp39rb",
		sub: "/bulan",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="none"
				aria-hidden="true">
				<circle cx="10" cy="10" r="9" fill="#916fff" />
				<path
					d="M10 5.5v9M7.5 7.8h3.25a1.75 1.75 0 010 3.5H7.5M7.5 11.3h4.25a1.75 1.75 0 010 3.5H7.5"
					stroke="#fff"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		pos: "absolute -right-2 bottom-10 z-20 sm:-right-8 md:-right-12 lg:-right-14",
		delay: "1s",
		duration: "6s",
	},
	{
		label: "3 kategori",
		sub: "study · creative · hiburan",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="none"
				aria-hidden="true">
				<rect x="2" y="2" width="7" height="7" rx="1.5" fill="#7c5cff" />
				<rect
					x="11"
					y="2"
					width="7"
					height="7"
					rx="1.5"
					fill="#7c5cff"
					opacity=".5"
				/>
				<rect
					x="2"
					y="11"
					width="7"
					height="7"
					rx="1.5"
					fill="#7c5cff"
					opacity=".35"
				/>
				<rect
					x="11"
					y="11"
					width="7"
					height="7"
					rx="1.5"
					fill="#7c5cff"
					opacity=".5"
				/>
			</svg>
		),
		pos: "absolute -right-2 top-2 z-20 hidden sm:block sm:-right-8 md:-right-12 lg:-right-14",
		delay: "2.2s",
		duration: "5.8s",
	},
	{
		label: "Aktivasi cepat",
		sub: "langsung bisa dipakai",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 20 20"
				fill="none"
				aria-hidden="true">
				<circle cx="10" cy="10" r="9" fill="#e45aef" />
				<path d="M11 4L5 11h5l-1 5 6-7h-5l1-5z" fill="#fff" />
			</svg>
		),
		pos: "absolute -left-2 bottom-10 z-20 hidden sm:block sm:-left-8 md:-left-12 lg:-left-14",
		delay: "0.6s",
		duration: "6.2s",
	},
];

export default function Hero() {
	return (
		<section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
			{/* Background glows */}
			<div className="pointer-events-none absolute inset-0" aria-hidden="true">
				<div className="animate-pulse-soft absolute top-0 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/15 blur-[120px]" />
				<div
					className="animate-pulse-soft absolute bottom-0 right-1/4 h-[400px] w-[500px] translate-y-1/2 rounded-full bg-brand-500/10 blur-[100px]"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className="relative mx-auto max-w-7xl px-5 md:px-8">
				<div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
					{/* Text side */}
					<div className="flex-1 text-center lg:max-w-xl lg:text-left">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-300">
							<span className="animate-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-400" />
							Paket aplikasi premium untuk pelajar &amp; mahasiswa
						</div>

						<h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
							Semua aplikasi premium,
							<br />
							<span className="animate-shimmer bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
								cukup 1 box. Sekali bayar.
							</span>
						</h1>

						<p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-secondary lg:mx-0 lg:text-xl">
							30 aplikasi premium dalam satu paket: bikin tugas, desain, sampai
							nonton. Semua aktif langsung setelah bayar, mulai{" "}
							<span className="font-semibold text-text-primary">Rp39.000</span>/
							bulan. Nggak perlu subscribe satu-satu lagi.
						</p>

						<div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
							<a
								href="#harga"
								className="sheen group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-brand-500 px-8 text-[15px] font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-400 hover:shadow-brand-400/30 hover:shadow-xl active:scale-[0.97]">
								Mulai Berlangganan
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									className="transition-transform group-hover:translate-x-0.5"
									aria-hidden="true">
									<path
										d="M3 8h10M9 4l4 4-4 4"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</a>
							<a
								href="#aplikasi"
								className="inline-flex h-13 items-center justify-center rounded-xl border border-border px-8 text-[15px] font-semibold text-text-secondary transition-all hover:border-brand-500/40 hover:text-text-primary active:scale-[0.97]">
								Lihat Daftar Aplikasi
							</a>
						</div>

						<div className="mt-8 flex items-center gap-3 text-sm text-text-muted lg:justify-start">
							<svg
								width="16"
								height="16"
								viewBox="0 0 20 20"
								fill="none"
								className="shrink-0 text-brand-400"
								aria-hidden="true">
								<path
									d="M10 2l2.09 4.26 4.71.69-3.4 3.32.8 4.69L10 12.67 5.8 14.96l.8-4.69-3.4-3.32 4.71-.69L10 2z"
									fill="currentColor"
								/>
							</svg>
							Dipakai mahasiswa di berbagai kampus Indonesia
						</div>
					</div>

					{/* Device side */}
					<div className="flex-1 flex justify-center w-full lg:w-auto">
						<div className="relative mx-auto w-fit max-w-[88vw]">
							{/* Glow behind device */}
							<div
								className="animate-pulse-soft pointer-events-none absolute top-1/2 left-1/2 h-[90%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-[60px]"
								aria-hidden="true"
							/>

							{/* Couple photo — top right, tucked behind device */}
							{/* <div className="absolute -right-1 -top-8 z-[50] rotate-12 sm:-right-8 md:-right-12 md:-top-14 lg:-right-16 lg:top-5">
								<div
									className="float-animate"
									style={{ animationDelay: "0.8s", animationDuration: "7s" }}>
									<div className="w-14 overflow-hidden rounded-3xl border border-border/70 bg-surface p-1.5 shadow-2xl shadow-black/60 sm:w-20 md:w-32 lg:w-36">
										<Image
											src="/watchingNetflix2.webp"
											alt="Pasangan tersenyum menonton di laptop"
											width={634}
											height={672}
											className="h-auto w-full rounded-2xl object-cover"
										/>
									</div>
								</div>
							</div> */}

							{/* Netflix photo — bottom left, tucked behind device */}
							{/* <div className="absolute -left-1 -bottom-6 z-[50] -rotate-6 sm:-left-8 md:-left-12 md:-bottom-12 lg:-left-16 lg:-bottom-1">
								<div
									className="float-animate"
									style={{ animationDelay: "1.6s", animationDuration: "7.5s" }}>
									<div className="w-16 overflow-hidden rounded-3xl border border-border/70 bg-surface p-1.5 shadow-2xl shadow-black/60 sm:w-24 md:w-44 lg:w-40">
										<Image
											src="/watchingNetflix.webp"
											alt="Orang sedang membuka aplikasi Netflix"
											width={1518}
											height={1226}
											className="h-auto w-full rounded-2xl object-cover"
										/>
									</div>
								</div>
							</div> */}

							{/* Device image */}
							<Image
								src="/box.webp"
								alt="Satu box berisi berbagai aplikasi premium"
								width={1254}
								height={1254}
								priority
className="relative z-10 h-auto w-70 rounded-4xl drop-shadow-2xl sm:w-64 md:w-80 lg:w-[500px]"
										/>

										{/* Floating cards */}
							{floatingCards.map((card) => (
								<div
									key={card.label}
									className={`float-animate ${card.pos}`}
									style={{
										animationDelay: card.delay,
										animationDuration: card.duration,
									}}>
									<div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-surface/90 px-3 py-2.5 shadow-xl shadow-black/40 backdrop-blur-md sm:gap-2.5 sm:px-4 sm:py-3">
										{card.icon}
										<div className="leading-tight">
											<p className="text-xs font-semibold text-text-primary sm:text-sm">
												{card.label}
											</p>
											<p className="hidden text-[10px] text-text-muted sm:block sm:text-[11px]">
												{card.sub}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
