const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = [
  ...expoConfig,
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'global.css', 'expo-env.d.ts'],
  },
  {
    rules: {
      'import/order': [
        'warn',
        { groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']] },
      ],
    },
  },
  {
    // Jest setup runs in the test environment, not the app.
    files: ['jest.setup.js', 'jest.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },
  {
    // Build tooling is CommonJS and runs in Node.
    files: ['scripts/**/*.cjs', '*.config.js', '*.config.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    // Tailwind resolves presets through require(); that is its contract.
    files: ['tailwind.config.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
