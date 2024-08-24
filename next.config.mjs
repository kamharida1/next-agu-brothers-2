/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {  serverComponentsExternalPackages: ["mongoose"], typedRoutes: true },
  webpack(config) {
      config.experiments = { ...config.experiments, topLevelAwait: true };
      return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // if your website has no www, drop it
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default nextConfig;
