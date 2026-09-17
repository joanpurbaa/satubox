export type AppCategory = "Study & Productivity" | "Creative" | "Entertainment";

export interface AppItem {
	name: string;
	src: string;
	category: AppCategory;
}

export const apps: AppItem[] = [
	{ name: "ChatGPT", src: "/chatgpt.webp", category: "Study & Productivity" },
	{ name: "Netflix", src: "/netflix.webp", category: "Entertainment" },
	{ name: "Spotify", src: "/spotify.webp", category: "Entertainment" },
	{ name: "CapCut Pro", src: "/capcut.webp", category: "Creative" },
	{
		name: "YouTube Premium",
		src: "/youtube.webp",
		category: "Entertainment",
	},
	{ name: "Canva Pro", src: "/canva.webp", category: "Creative" },
	{ name: "Duolingo", src: "/duolingo.webp", category: "Study & Productivity" },
	{ name: "Crunchyroll", src: "/crunchyroll.webp", category: "Entertainment" },
	{ name: "Vidio", src: "/vidio.webp", category: "Entertainment" },
	{ name: "Disney+", src: "/disney.webp", category: "Entertainment" },
	{ name: "Bstation", src: "/bstation.webp", category: "Entertainment" },
	{ name: "HBO Max", src: "/hbomax.webp", category: "Entertainment" },
	{ name: "Viu", src: "/viu.webp", category: "Entertainment" },
	{ name: "Apple TV", src: "/apple-tv.webp", category: "Entertainment" },
	{ name: "Apple Music", src: "/apple-music.webp", category: "Entertainment" },
	{
		name: "Grammarly",
		src: "/grammarly.webp",
		category: "Study & Productivity",
	},
	{
		name: "WPS Office",
		src: "/wps-office.webp",
		category: "Study & Productivity",
	},
	{
		name: "CamScanner",
		src: "/camscanner.webp",
		category: "Study & Productivity",
	},
	{
		name: "Microsoft 365",
		src: "/microsoft.webp",
		category: "Study & Productivity",
	},
	{ name: "DeepL", src: "/deepl.webp", category: "Study & Productivity" },
	{ name: "iLovePDF", src: "/ilovepdf.webp", category: "Study & Productivity" },
	{ name: "QuillBot", src: "/quillbot.webp", category: "Study & Productivity" },
	{ name: "Scribd", src: "/scribd.webp", category: "Study & Productivity" },
	{ name: "Alight Motion", src: "/alight-motion.webp", category: "Creative" },
	{ name: "Picsart", src: "/picsart.webp", category: "Creative" },
	{ name: "Remini", src: "/remini.webp", category: "Creative" },
	{ name: "WeTV", src: "/wetv.webp", category: "Entertainment" },
	{ name: "Loklok", src: "/loklok.webp", category: "Entertainment" },
	{ name: "iQIYI", src: "/iqiyi.webp", category: "Entertainment" },
	{ name: "Youku", src: "/youku.webp", category: "Entertainment" },
];

export const categories: ("Semua" | AppCategory)[] = [
	"Semua",
	"Study & Productivity",
	"Creative",
	"Entertainment",
];
