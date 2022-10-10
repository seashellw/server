/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/server",
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
