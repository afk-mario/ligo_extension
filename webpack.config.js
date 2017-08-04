const path = require('path');
const nib = require('nib');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    sourceMapFilename: '[name].map',
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              use: [nib()],
              import: ['~nib/lib/nib/index.styl'],
            },
          },
        ],
      },
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
};
