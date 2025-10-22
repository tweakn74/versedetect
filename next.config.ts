import type { NextConfig } from "next";

const repositoryName = "versedetect";
const isProd = process.env.NODE_ENV === "production";
const basePathValue =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? `/${repositoryName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePathValue || undefined,
  assetPrefix: basePathValue ? `${basePathValue}/` : undefined,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePathValue,
  },
};

export default nextConfig;
