module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },
  coveragePathIgnorePatterns: ['/core/(models|dto)/'],
  collectCoverageFrom: ['(src|cdk|scripts)/**/*.ts', '!**/node_modules/**'],
  moduleFileExtensions: ['ts', 'js', 'json']
};
