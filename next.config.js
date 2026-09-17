/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    '@aws-sdk/client-comprehend',
    '@aws-sdk/client-rekognition',
    'sharp',
  ],
  outputFileTracingIncludes: {
    '/admin': ['./node_modules/@img/sharp-libvips-linux-x64/lib/**'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
