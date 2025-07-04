/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['neo4j-driver'],
  images: {
    domains: ['images.clerk.dev', 'www.gravatar.com']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  }
};

module.exports = nextConfig;
