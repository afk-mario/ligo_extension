module.exports = {
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    webextensions: true,
  },
  rules: {
    'no-console': 0,
    'no-param-reassign': 0,
  },
  globals: {
    browser: true,
    document: true,
    localStorage: true,
    chrome: true,
    fetch: true,
    Request: true,
    Headers: true,
    location: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
