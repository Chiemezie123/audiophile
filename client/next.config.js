/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Disable caching completely on Windows
    if (process.platform === "win32") {
      config.cache = false;

      // Disable file system watching optimizations
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };

      // Disable problematic snapshot features
      config.snapshot = {
        managedPaths: [],
        immutablePaths: [],
      };
    }

    return config;
  },
};

module.exports = nextConfig;
