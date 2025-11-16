/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow importing server-side helpers (AI + scraper integration) from the monorepo root
    externalDir: true,
  },
};

module.exports = nextConfig;

