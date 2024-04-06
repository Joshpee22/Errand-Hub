// index.js

const { Pool } = require('pg');
require('dotenv').config();   // Loading environment variables from a .env file into process.env

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
});

function query(text, params) {
  return new Promise((resolve, reject) => {
    // Executing a query using the pool connection
    pool.query(text, params)
      .then((res) => {
        resolve(res); // Resolving with the result of the query
      })
      .catch((err) => {
        reject(err); // Rejecting with the error if the query fails
      });
  });
}
module.exports = {
  query,
};