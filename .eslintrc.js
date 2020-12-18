module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'filenames', 'react-hooks'],
  env: {
    browser: true,
    webextensions: true,
  },
  rules: {
    'no-console': 0,
    'no-param-reassign': 0,
    'filenames/match-regex': [2, '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$', true],
    'filenames/match-exported': [2, ['kebab']],
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
  overrides: [
    {
      files: '*.test.js',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['webpack.*', '.*'],
      rules: {
        'no-underscore-dangle': 'off',
        'filenames/match-regex': 'off',
        'filenames/match-exported': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
