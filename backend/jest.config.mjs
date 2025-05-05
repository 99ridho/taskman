// jest.config.mjs
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(bcrypt-ts)/)', // allow ESM-only bcrypt-ts
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // fix import paths if needed
  },
};
