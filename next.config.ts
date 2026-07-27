import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    VITE_WEB3FORMS_ACCESS_KEY: process.env.VITE_WEB3FORMS_ACCESS_KEY,
  },
};

export default nextConfig;
