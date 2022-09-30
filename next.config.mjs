/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/server",
  output: "standalone",
  compiler: {
    emotion: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
