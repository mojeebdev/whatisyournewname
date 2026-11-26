import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Keep the custom fonts available to the dynamic Open Graph card route.
  outputFileTracingIncludes: {
    "/api/card": ["./assets/fonts/**/*"],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
