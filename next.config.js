const withPWA = require("next-pwa");

const fs = require('fs');
const path = require('path');

// module.exports = withPWA({
module.exports = {
  i18n: {
    locales: ["en", "my"],
    defaultLocale: "en",
  },
  reactStrictMode: true,
  // swcMinify: true,
  compiler: {
    removeConsole: false,
  },
  images: {
    domains: ["robohash.org", "res.cloudinary.com", "dptvo-store.com", "threadlogic.com", "celio.tn","127.0.0.1", "dummyimage.com","tnprime.org","www.tnprime.shop","tnprime.shop"],
  },

  // devServer: {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  //     cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'))
  //   }
  // },
  pwa: {
    dest: "public",
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
// });
