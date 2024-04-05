import db from './index.js'; // Importing the 'db' module for database operations

const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(128) UNIQUE NOT NULL,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        user_role VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

(() => {
  db.query(queryText) // Executes a database query to create the users table if it doesn't exist
    .then(() => {
    })
    .catch((err) => {
      console.log(err); // Logging any errors that occur during database query execution
    });
})();