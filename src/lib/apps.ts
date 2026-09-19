export type AppCategory = "Study & Productivity" | "Creative" | "Entertainment";

export type ExtCat =
	| "STREAMING"
	| "MUSIK"
	| "KREATIF"
	| "PRODUKTIVITAS"
	| "PENDIDIKAN"
	| "LAINNYA";

export interface AppItem {
	name: string;
	src: string;
	category: AppCategory;
	domains: string[];
	cat: ExtCat;
}

export const apps: AppItem[] = [
	{
		name: "ChatGPT",
		src: "/chatgpt.webp",
		category: "Study & Productivity",
		domains: ["openai.com", "chatgpt.com", "chat.openai.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "Netflix",
		src: "/netflix.webp",
		category: "Entertainment",
		domains: ["netflix.com"],
		cat: "STREAMING",
	},
	{
		name: "Spotify",
		src: "/spotify.webp",
		category: "Entertainment",
		domains: ["spotify.com"],
		cat: "MUSIK",
	},
	{
		name: "CapCut Pro",
		src: "/capcut.webp",
		category: "Creative",
		domains: ["capcut.com"],
		cat: "KREATIF",
	},
	{
		name: "YouTube Premium",
		src: "/youtube.webp",
		category: "Entertainment",
		domains: ["youtube.com"],
		cat: "STREAMING",
	},
	{
		name: "Canva Pro",
		src: "/canva.webp",
		category: "Creative",
		domains: ["canva.com"],
		cat: "KREATIF",
	},
	{
		name: "Duolingo",
		src: "/duolingo.webp",
		category: "Study & Productivity",
		domains: ["duolingo.com"],
		cat: "PENDIDIKAN",
	},
	{
		name: "Crunchyroll",
		src: "/crunchyroll.webp",
		category: "Entertainment",
		domains: ["crunchyroll.com"],
		cat: "STREAMING",
	},
	{
		name: "Vidio",
		src: "/vidio.webp",
		category: "Entertainment",
		domains: ["vidio.com"],
		cat: "STREAMING",
	},
	{
		name: "Disney+",
		src: "/disney.webp",
		category: "Entertainment",
		domains: ["disneyplus.com"],
		cat: "STREAMING",
	},
	{
		name: "Bstation",
		src: "/bstation.webp",
		category: "Entertainment",
		domains: ["bilibili.com"],
		cat: "STREAMING",
	},
	{
		name: "HBO Max",
		src: "/hbomax.webp",
		category: "Entertainment",
		domains: ["hbomax.com"],
		cat: "STREAMING",
	},
	{
		name: "Prime Video",
		src: "/prime.webp",
		category: "Entertainment",
		domains: ["primevideo.com"],
		cat: "STREAMING",
	},
	{
		name: "Viu",
		src: "/viu.webp",
		category: "Entertainment",
		domains: ["viu.com"],
		cat: "STREAMING",
	},
	{
		name: "Apple TV",
		src: "/apple-tv.webp",
		category: "Entertainment",
		domains: ["tv.apple.com"],
		cat: "STREAMING",
	},
	{
		name: "Apple Music",
		src: "/apple-music.webp",
		category: "Entertainment",
		domains: ["music.apple.com"],
		cat: "MUSIK",
	},
	{
		name: "Grammarly",
		src: "/grammarly.webp",
		category: "Study & Productivity",
		domains: ["grammarly.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "WPS Office",
		src: "/wps-office.webp",
		category: "Study & Productivity",
		domains: ["wps.cn", "wps.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "CamScanner",
		src: "/camscanner.webp",
		category: "Study & Productivity",
		domains: ["camscanner.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "Microsoft 365",
		src: "/microsoft.webp",
		category: "Study & Productivity",
		domains: ["office.com", "microsoft365.com", "microsoft.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "DeepL",
		src: "/deepl.webp",
		category: "Study & Productivity",
		domains: ["deepl.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "iLovePDF",
		src: "/ilovepdf.webp",
		category: "Study & Productivity",
		domains: ["ilovepdf.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "QuillBot",
		src: "/quillbot.webp",
		category: "Study & Productivity",
		domains: ["quillbot.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "Scribd",
		src: "/scribd.webp",
		category: "Study & Productivity",
		domains: ["scribd.com"],
		cat: "PRODUKTIVITAS",
	},
	{
		name: "Alight Motion",
		src: "/alight-motion.webp",
		category: "Creative",
		domains: ["alightcreative.com"],
		cat: "KREATIF",
	},
	{
		name: "Picsart",
		src: "/picsart.webp",
		category: "Creative",
		domains: ["picsart.com"],
		cat: "KREATIF",
	},
	{
		name: "Remini",
		src: "/remini.webp",
		category: "Creative",
		domains: ["remini.ai"],
		cat: "KREATIF",
	},
	{
		name: "WeTV",
		src: "/wetv.webp",
		category: "Entertainment",
		domains: ["wetv.vip"],
		cat: "STREAMING",
	},
	{
		name: "Loklok",
		src: "/loklok.webp",
		category: "Entertainment",
		domains: ["loklok.com"],
		cat: "STREAMING",
	},
	{
		name: "iQIYI",
		src: "/iqiyi.webp",
		category: "Entertainment",
		domains: ["iqiyi.com"],
		cat: "STREAMING",
	},
	{
		name: "Youku",
		src: "/youku.webp",
		category: "Entertainment",
		domains: ["youku.com"],
		cat: "STREAMING",
	},
];

export const categories: ("Semua" | AppCategory)[] = [
	"Semua",
	"Study & Productivity",
	"Creative",
	"Entertainment",
];