import Image from "next/image";

const values = [
	{
		number: "01",
		img: "/allinone.webp",
		imgW: 1122,
		imgH: 1402,
		imgAlt: "Ilustrasi satu paket SatuBox",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true">
				<path
					d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
					stroke="#916fff"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		title: "Lebih hemat dari subscribe satu-satu",
		desc:
			"Subscribe aplikasi satu-satu bisa bikin kantong jebol. Bayar sekali, kamu dapat akses 30 aplikasi sekaligus untuk semua kebutuhanmu.",
	},
	{
		number: "02",
		img: "/box.webp",
		imgW: 1254,
		imgH: 1254,
		imgAlt: "Ilustrasi akses semua aplikasi dalam satu tempat",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true">
				<rect
					x="3"
					y="3"
					width="7"
					height="7"
					rx="1.5"
					stroke="#916fff"
					strokeWidth="2"
				/>
				<rect
					x="14"
					y="3"
					width="7"
					height="7"
					rx="1.5"
					stroke="#916fff"
					strokeWidth="2"
				/>
				<rect
					x="3"
					y="14"
					width="7"
					height="7"
					rx="1.5"
					stroke="#916fff"
					strokeWidth="2"
				/>
				<rect
					x="14"
					y="14"
					width="7"
					height="7"
					rx="1.5"
					stroke="#916fff"
					strokeWidth="2"
				/>
			</svg>
		),
		title: "Semua kebutuhan dalam satu tempat",
		desc:
			"Dari mengerjakan tugas, bikin desain, sampai nonton, nggak perlu lagi buka banyak app.",
	},
	{
		number: "03",
		img: "/access.webp",
		imgW: 1122,
		imgH: 1402,
		imgAlt: "Ilustrasi semua aplikasi siap pakai",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true">
				<path
					d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
					stroke="#916fff"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		title: "Aktivasi cepat & langsung dipakai",
		desc:
			"Setelah bayar, kamu langsung dapat akses ke semua aplikasi. Tanpa ribet, tanpa nunggu lama.",
	},
];

export default function ValueProp() {
	return (
		<section className="bg-surface-alt py-20 md:py-28" id="value">
			<div className="mx-auto max-w-6xl px-5 md:px-8">
				<div className="reveal">
					<span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
						01 · Keunggulan
					</span>
					<h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
						Kenapa mahasiswa pilih SatuBox?
					</h2>
					<p className="mt-4 text-lg text-text-secondary">
						Karena mahasiswa butuh aplikasi premium yang lengkap, cepat, dan nggak
						bikin kantong jebol.
					</p>
				</div>

				<div className="reveal-stagger mt-14 grid gap-6 md:grid-cols-3">
					{values.map((v) => (
						<div
							key={v.title}
							className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/[0.06]">
							{/* Illustration */}
							<div className="relative aspect-square border-b border-border/60">
								<Image
									src={v.img}
									alt={v.imgAlt}
									width={v.imgW}
									height={v.imgH}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div
									className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090812]/30 to-transparent"
									aria-hidden="true"
								/>

								{/* Icon chip */}
								<div className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-[#11101c]/70 text-brand-300 shadow-lg shadow-black/30 backdrop-blur-md">
									{v.icon}
								</div>
							</div>

							{/* Text */}
							<div className="relative p-6">
								{/* Watermark number */}
								<span
									aria-hidden="true"
									className="pointer-events-none absolute -right-1 -bottom-7 text-[6.5rem] font-extrabold leading-none text-brand-500/[0.05] select-none">
									{v.number}
								</span>

								<h3 className="relative text-lg font-semibold text-text-primary">
									{v.title}
								</h3>
								<p className="relative mt-2 text-[15px] leading-relaxed text-text-secondary">
									{v.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
