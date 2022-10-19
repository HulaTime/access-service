module.exports = {
  testTimeout: 60000,
  automock: false,
  bail: false,
  collectCoverageFrom: [
    '*/**/*.{js,ts}',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  globals: {
    __DEV__: true,
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'node'],
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  // reporters: ['default', 'jest-junit'],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'json', 'json-summary', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
