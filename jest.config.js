module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
      '@domain/(.*)': '<rootDir>/src/domain/$1',
      '@application/(.*)': '<rootDir>/src/application/$1',
      '@infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
      '@tests/(.*)': '<rootDir>/tests/$1'
  }
};