import type { NextConfig } from "next";

const siteUrl = new URL(process.env.SITE_URL?.trim() || "https://rankmonk.io");
const apex = siteUrl.host.replace(/^www\./, "");
const isProd = process.env.NODE_ENV === "production";

// 'unsafe-inline' is required for Next's inline bootstrap scripts and the GA snippet
// without a nonce (nonces would force every page to render dynamically).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/(images|tiles)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
  async redirects() {
    return [
      // Canonical host: www → apex (the Vercel domain settings should do the same).
      ...(apex !== siteUrl.host ? [] : [{ source: "/:path*", has: [{ type: "host" as const, value: `www.${apex}` }], destination: `${siteUrl.origin}/:path*`, permanent: true }]),
      // Section roots without their own page go to the first item (temporary: they may get pages later).
      { source: "/solutions", destination: "/solutions/brands", permanent: false },
      { source: "/industries", destination: "/industries/healthcare", permanent: false },
    ];
  },
};

export default nextConfig;
