const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      '@store': path.resolve(__dirname, 'src/store'),
      '@modules': path.resolve(__dirname, 'src/modules'),
    }
  };

  return config;
};
