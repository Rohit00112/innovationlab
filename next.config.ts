import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://img.freepik.com https://*.smushcdn.com https://*.s3.amazonaws.com https://*.supabase.co https://gravatar.com https://www.gravatar.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://*.imgix.net https://*.public.blob.vercel-storage.com https://utfs.io https://www.google.com https://maps.googleapis.com https://maps.gstatic.com https://images.stockcake.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://www.google.com https://maps.google.com;
  connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com https://www.google-analytics.com https://vitals.vercel-insights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  // Prevent XSS attacks
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions policy (formerly Feature-Policy)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // HSTS - enforce HTTPS (only in production)
  ...(!isDev
    ? [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ]
    : []),
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: isDev ? "" : ContentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  // Disable x-powered-by header
  poweredByHeader: false,

  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders.filter((h) => h.value), // Filter out empty headers
      },
      {
        // Cache static assets
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      // Unsplash - for stock images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Freepik - for stock images and avatars
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      // Smush CDN - WordPress image optimization
      {
        protocol: "https",
        hostname: "*.smushcdn.com",
      },
      // Cloudinary - if using for image hosting
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // AWS S3 - common storage
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      // Supabase storage - if using Supabase
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Gravatar - for user avatars
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
      // GitHub avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Google user content (profile pictures)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Imgix - common image CDN
      {
        protocol: "https",
        hostname: "*.imgix.net",
      },
      // Vercel Blob storage
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Uploadthing - if using for uploads
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      // Stockcake - stock images
      {
        protocol: "https",
        hostname: "images.stockcake.com",
      },
      // Allow localhost for development
      ...(isDev
        ? [
          {
            protocol: "http" as const,
            hostname: "localhost",
          },
        ]
        : []),
    ],
  },
};

export default nextConfig;
