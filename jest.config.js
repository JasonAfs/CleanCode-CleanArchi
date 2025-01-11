module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
      '@domain/(.*)': '<rootDir>/src/domain/$1',
      '@application/(.*)': '<rootDir>/src/application/$1'
    }
  };