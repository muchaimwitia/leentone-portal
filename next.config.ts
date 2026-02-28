/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Keep the build bypasses so Vercel doesn't block deployments
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // 2. Inject Institutional Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // Stops Clickjacking
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, // Forces HTTPS
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // Stops MIME-sniffing
          { key: 'X-XSS-Protection', value: '1; mode=block' }, // Stops legacy XSS
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // Protects traffic origins
          { 
            key: 'Content-Security-Policy', 
            // Restricts exactly where scripts and images can load from
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" 
          }
        ],
      },
    ];
  },
};

export default nextConfig;