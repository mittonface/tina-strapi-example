const tinaWebpackHelpers = require("@tinacms/webpack-helpers");

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) {
      tinaWebpackHelpers.aliasTinaDev(config, "../tinacms");
    }
    return config;
  },
};
