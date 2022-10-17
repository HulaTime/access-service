module.exports = {
  extends: ['eslint-config-sensible-style'],
  overrides: [{
    files: 'types/api.d.ts',
    rules: {
      '@typescript-eslint/no-empty-interface': 'off'
    }
  }]
};
