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
  testResultsProcessor: 'jest-bamboo-reporter',
  reporters: ['default', 'jest-junit'],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'json', 'json-summary', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: COVERAGE_LEVEL,
      functions: COVERAGE_LEVEL,
      lines: COVERAGE_LEVEL,
      statements: COVERAGE_LEVEL,
    },
  },
};
