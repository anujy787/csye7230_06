/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transformIgnorePatterns: ['/node_modules/(?!MODULE_NAME_HERE).+\\.js$'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};

module.exports = config;
