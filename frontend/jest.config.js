/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transformIgnorePatterns: ['/node_modules/(?!MODULE_NAME_HERE).+\\.js$'],
};

module.exports = config;
