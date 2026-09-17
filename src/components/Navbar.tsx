"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
	{ label: "Daftar Aplikasi", href: "#aplikasi" },
	{ label: "Harga", href: "#harga" },
	{ label: "Cara Kerja", href: "#cara-kerja" },
	{ label: "FAQ", href: "#faq" },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (mobileOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
				scrolled
					? "bg-surface/80 backdrop-blur-lg shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
					: "bg-transparent"
			}`}>
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
				{/* Logo */}
				<a
					href="#"
					className="flex items-center gap-2"
					aria-label="SatuBox Beranda">
					<Image
						src="/icon.png"
						alt="Logo SatuBox"
						width={28}
						height={28}
						className="h-7 w-7 rounded-lg"
					/>
					<span className="text-lg font-bold tracking-tight text-text-primary">
						SatuBox
					</span>
				</a>

				{/* Desktop Nav */}
				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
							{link.label}
						</a>
					))}
					<a
						href="#harga"
						className="sheen rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-400 active:scale-[0.97]">
						Mulai Berlangganan
					</a>
				</div>

				{/* Mobile Hamburger */}
				<button
					onClick={() => setMobileOpen(!mobileOpen)}
					className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-dim md:hidden"
					aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
					aria-expanded={mobileOpen}>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						aria-hidden="true">
						{mobileOpen ? (
							<path
								d="M5 5l10 10M15 5L5 15"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						) : (
							<>
								<path
									d="M3 5h14"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<path
									d="M3 10h14"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
								<path
									d="M3 15h14"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</>
						)}
					</svg>
				</button>
			</nav>

			{/* Mobile Menu */}
			<div
				className={`absolute top-full left-0 right-0 border-t border-border bg-surface-alt/95 backdrop-blur-lg transition-all duration-300 md:hidden ${
					mobileOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-2 pointer-events-none"
				}`}>
				<div className="flex flex-col gap-1 px-5 py-4">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={() => setMobileOpen(false)}
							className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-dim hover:text-text-primary">
							{link.label}
						</a>
					))}
					<a
						href="#harga"
						onClick={() => setMobileOpen(false)}
						className="sheen mt-2 rounded-lg bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-brand-400">
						Mulai Berlangganan
					</a>
				</div>
			</div>
		</header>
	);
}
