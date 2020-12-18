module.exports = {
  verbose: true,
  sourceDir: 'dist',
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: 'firefox-developer-edition',
    browserConsole: true,
    startUrl: [
      'about:debugging',
      'https://melanie-richards.com/blog/css-grid-sticky',
    ],
  },
};
