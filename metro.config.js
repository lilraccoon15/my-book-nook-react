const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      sourceExts: [...sourceExts, 'css'], // Ajoutez l'extension .css aux extensions sources
    },
  };
})();