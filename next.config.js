/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // suppress all lint errors during Vercel builds
      },
};

module.exports = nextConfig;
