const esmModules = [
  '@middy/core',
  '@middy/secrets-manager',
  '@middy/util',
  '@middy/event-normalizer',
  '@middy/http-json-body-parser',
  '@middy/http-error-handler',
  '@middy/do-not-wait-for-empty-event-loop',
  '@middy/http-event-normalizer',
  '@middy/http-header-normalizer',
  '@middy/http-response-serializer',
  '@middy/http-urlencode-path-parser'
];

module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(j|t)sx?$': '@swc/jest'
  },
  coveragePathIgnorePatterns: ['/core/(models|dto)/'],
  collectCoverageFrom: ['(src|cdk|scripts)/**/*.ts', '!**/node_modules/**'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    ...esmModules.reduce(
      (acc, module) => {
        acc[`^${module}$`] = `<rootDir>/node_modules/${module}`;
        return acc;
      },
      { '^@/(.*)$': '<rootDir>/src/$1' } as Record<string, string>
    )
  },
  transformIgnorePatterns: [`node_modules/(?!${esmModules.join('|')})`]
};
