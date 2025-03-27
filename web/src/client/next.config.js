/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build for production if you want to
  // eslint: {
  //   // Only run ESLint on these directories during production builds
  //   dirs: ['app', 'components', 'lib', 'utils'],
  //   // Warning instead of error
  //   ignoreDuringBuilds: false,
  // },
  // Don't fail the build when TypeScript errors occur
  typescript: {
    // !! Only use this if you want to deploy with TypeScript errors
    // ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
