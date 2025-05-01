/**
 * @type {import('next').NextConfig}
 * @type {import('next-pwa')}
 */

const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  dynamicStartUrl: false,
  cacheStartUrl: false,
  runtimeCaching: [
    {
      urlPattern: /\/$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "home",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 1 / 2,
      },
    },
    ...runtimeCaching,
    {
      urlPattern: /\/api\/start/,
      handler: "NetworkOnly",
      method: "POST",
      options: {
        backgroundSync: {
          name: "offlineQueue",
          options: {
            maxRetentionTime: 30,
          },
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = withPWA(nextConfig);
