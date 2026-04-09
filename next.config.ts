import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Rădăcină proiect: preferă folderul cu next.config (nu ~/, unde poate exista alt lockfile)
const configDir = path.dirname(fileURLToPath(import.meta.url));
const hasPkg = (dir: string) => fs.existsSync(path.join(dir, "package.json"));
const projectRoot = hasPkg(configDir)
  ? path.resolve(configDir)
  : hasPkg(process.cwd())
    ? path.resolve(process.cwd())
    : path.resolve(configDir);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "draperandkramer.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
