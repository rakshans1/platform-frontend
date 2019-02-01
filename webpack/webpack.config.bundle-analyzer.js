const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const { DuplicatesPlugin } = require("inspectpack/plugin");

const merge = require("webpack-merge");

const prodConfig = require("./webpack.config.prod");

const date = new Date();
const formattedDate = `${date.getMonth()-1}_${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;

const bundleAnalyzerConfig = merge(prodConfig, {
  plugins: [new BundleAnalyzerPlugin({reportFilename:`report${formattedDate}.html`,logLevel: "silent", analyzerMode:"static"})],
});

module.exports = bundleAnalyzerConfig;
