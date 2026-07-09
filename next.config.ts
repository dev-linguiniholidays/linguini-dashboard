import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => {
    // Force a unique build ID based on the Git commit hash on Vercel, fallback to timestamp
    return process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString();
  },
};

export default nextConfig;
