module.exports = {
  env: {
    'browser': true,
    'es2021': true,
  },
  extends: [
    'google',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'require-jsdoc': 'off',
    'new-cap': 'off',
    'indent': 'off',
    'quote-props': 'off',
    'max-len': 'off',
    'valid-jsdoc': 'off',
    '@typescript-eslint/indent': ['warn', 2],
  },
};
