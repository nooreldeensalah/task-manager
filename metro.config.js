const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure CommonJS bundles (.cjs) are treated as source files for Metro resolution.
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// Guard against .cjs being mistakenly categorized as asset extensions.
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'cjs');

module.exports = config;
