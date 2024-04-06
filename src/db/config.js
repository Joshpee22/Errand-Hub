// config.js

require('dotenv').config(); // Loading environment variables from a .env file into process.env

module.exports = {
  development: process.env.DATABASE_URL,
  test: process.env.DATABASE_URL_TEST,
};