/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: ['*.md', 'dist/', 'coverage/'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-refresh', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    // React 18 — no need to import React for JSX
    'react/react-in-jsx-scope': 'off',
    // prop-types is redundant in TypeScript projects
    'react/prop-types': 'off',
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Hooks
    'react-hooks/exhaustive-deps': 'warn',
    // Fast Refresh
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // Prettier as ESLint rule
    'prettier/prettier': 'error',
  },
};
