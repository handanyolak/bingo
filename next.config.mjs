import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@reown/appkit",
      "@reown/appkit-adapter-wagmi",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "lottie-react",
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      lodash: "lodash-es",
    };
    return config;
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
