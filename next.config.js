/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        windowHistorySupport: true,
        serverComponentsExternalPackages: ["libsql"],
      },
};

module.exports = nextConfig;
