module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  ignorePatterns: [
    '.eslintrc.js',
    'gulpfile.js',
    'node_modules/**',
    'dist/**',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        // Add project-specific rules here
      },
    },
  ],
};
