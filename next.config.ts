/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' blob: data: https://tiles.openfreemap.org https://images.pexels.com https://images.unsplash.com; connect-src 'self' https://tiles.openfreemap.org https://unpkg.com https://images.pexels.com https://images.unsplash.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self';"
          }
        ],
      },
    ];
  },
};

export default nextConfig;