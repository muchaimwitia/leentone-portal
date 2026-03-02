/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // The crucial additions here are worker-src blob:, img-src blob:, and the unpkg/openfreemap domains
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' blob: data: https://tiles.openfreemap.org; connect-src 'self' https://tiles.openfreemap.org https://unpkg.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self';"
          }
        ],
      },
    ];
  },
};

export default nextConfig;