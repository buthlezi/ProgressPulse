module.exports = {
  root: true,
  env: { es6: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'prettier', // keep last
  ],
  ignorePatterns: ['dist/', 'build/', '.expo/', 'node_modules/'],
};
