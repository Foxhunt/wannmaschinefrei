/** 
 * @type {import('next').NextConfig}
 */

const runtimeCaching = require('next-pwa/cache')

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching: [
    ...runtimeCaching,
    {
      urlPattern: /\/api\/start/i,
      handler: 'NetworkFirst',
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'offlineQueue',
          options: {
            maxRetentionTime: 30,
          }
        }
      }
    }
  ]
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withPWA(nextConfig)
