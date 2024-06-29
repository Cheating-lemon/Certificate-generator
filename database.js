const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "TestDB",
  password: "lemon",
  port: 5000,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("~ Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
};

const disconnectDB = async () => {
  try {
    await client.end();
    console.log("~ Disconnected from the database");
  } catch (err) {
    console.error("Error disconnecting from the database", err);
  }
};

const createUsersTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      college VARCHAR(50),
      roll_number VARCHAR(20) UNIQUE,
      certificate_id VARCHAR(20),
      grade VARCHAR(5),
      domain VARCHAR(50),
      certificate TEXT DEFAULT NULL
    )`;
  try {
    await client.query(queryText);
    console.log("~ Users table created successfully");
  } catch (err) {
    console.error("~ Error creating users table", err);
  }
};

module.exports = {
  client,
  connectDB,
  disconnectDB,
  createUsersTable,
};
