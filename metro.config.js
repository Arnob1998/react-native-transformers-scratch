const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add support for ONNX files
defaultConfig.resolver.assetExts.push('onnx');

// Add support for JSON files
defaultConfig.resolver.assetExts.push('json');
defaultConfig.resolver.sourceExts = defaultConfig.resolver.sourceExts.filter(
  (ext) => ext !== 'json'
);

module.exports = defaultConfig;
