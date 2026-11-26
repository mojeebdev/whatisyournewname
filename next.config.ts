import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make sure the card fonts ship with the serverless function.
  outputFileTracingIncludes: {
    "/api/card": ["./assets/fonts/**/*"],
  },
};

export default nextConfig;
