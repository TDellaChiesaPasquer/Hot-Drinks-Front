// Anout d'un configuratioj nécessaire pour intruduire des fichiers SVG dans le projet
const { getDefaultConfig } = require("expo/metro-config");
module.exports = (() => {
	const config = getDefaultConfig(__dirname);

	config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
	config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
	config.resolver.sourceExts.push("svg");

	return config;
})();
