/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.logo.dev'],
  },
  turbopack: {},
  // Suppress build warnings for packages with optional browser APIs
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
