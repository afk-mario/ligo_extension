const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const output = path.resolve(process.cwd(), "dist");
const assets = path.resolve(process.cwd(), "src/public");

module.exports = {
  devtool: "cheap-module-source-map",
  entry: { ligo: "./src/ligo.js", options: "./src/options.js" },
  output: {
    filename: "[name].js",
    path: output,
    sourceMapFilename: "[name].map"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: assets,
        to: output
      }
    ]),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    })
  ],

  resolve: {
    modules: ["node_modules"],
    alias: {
      "~lib": path.resolve("./src/lib/"),
      "~components": path.resolve("./src/components"),
      "~containers": path.resolve("./src/containers"),
      "~public": path.resolve("./src/public")
    }
  }
};
