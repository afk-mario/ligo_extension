const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const output = path.resolve(process.cwd(), 'dist');
const assets = path.resolve(process.cwd(), 'src/public');

module.exports = {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: output,
    historyApiFallback: true,
    hot: true,
    open: true,
    openPage: 'popup.html',
    writeToDisk: true,
  },
  entry: {
    ligo: ['@babel/polyfill', './src/index.js'],
    background: ['@babel/polyfill', './src/background.js'],
  },
  output: {
    path: output,
    filename: '[name].js',
    sourceMapFilename: '[name].[contenthash].map',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: assets,
          to: output,
        },
      ],
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};
