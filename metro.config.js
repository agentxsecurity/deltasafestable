const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add font file extensions
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.assetExts.push('ttf', 'otf');

// Add source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg', 'mjs'];

// Handle the material-design-icons alias for both mobile and web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@react-native-vector-icons/material-design-icons') {
    return {
      filePath: require.resolve('@expo/vector-icons/MaterialCommunityIcons'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
