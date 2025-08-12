const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    apiUrl: 'https://serverest.dev'
  },
  e2e: {}
});
