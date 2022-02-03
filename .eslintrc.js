module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    indent: ['error', 2]
  }
}
