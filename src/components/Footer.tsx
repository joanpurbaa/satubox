import Image from "next/image";

const footerLinks = [
	{ label: "Daftar Aplikasi", href: "#aplikasi" },
	{ label: "Cara Kerja", href: "#cara-kerja" },
	{ label: "Harga", href: "#harga" },
	{ label: "FAQ", href: "#faq" },
];

export default function Footer() {
	return (
		<footer className="border-t border-border">
			<div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
				<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
					<div className="text-center md:text-left">
						<div className="flex items-center justify-center gap-2 md:justify-start">
							<Image
								src="/icon.png"
								alt="Logo SatuBox"
								width={24}
								height={24}
								className="h-6 w-6 rounded-lg"
							/>
							<span className="text-base font-bold tracking-tight text-text-primary">
								SatuBox
							</span>
						</div>
<p className="mt-2 text-sm text-text-secondary">
						Paket aplikasi premium untuk pelajar & mahasiswa.
					</p>
					<a
						href="https://www.instagram.com/satuboxx"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-brand-500/40 hover:text-text-primary">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							className="text-brand-400"
							aria-hidden="true">
							<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="5"
								stroke="currentColor"
								strokeWidth="1.8"
							/>
							<circle
								cx="12"
								cy="12"
								r="4"
								stroke="currentColor"
								strokeWidth="1.8"
							/>
							<circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
						</svg>
						@satuboxx
						<span className="rounded-full bg-surface-dim px-2 py-0.5 text-[10px] font-semibold text-text-muted">
							CS Admin
						</span>
					</a>
					</div>

					<nav className="flex items-center gap-6" aria-label="Tautan footer">
						{footerLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
								{link.label}
							</a>
						))}
					</nav>
				</div>

				<div className="mt-10 border-t border-border-light pt-6 text-center">
					<p className="text-xs text-text-muted">
						© {new Date().getFullYear()} SatuBox. Semua hak cipta dilindungi.
					</p>
				</div>
			</div>
		</footer>
	);
}
