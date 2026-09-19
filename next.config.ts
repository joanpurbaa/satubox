import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["firebase-admin"],
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
			},
		];
	},
};

export default nextConfig;
