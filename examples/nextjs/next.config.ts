import type { NextConfig } from "next";

const config: NextConfig = {
	experimental: {
		reactCompiler: true,
		useCache: true,
	},
};

export default config;
