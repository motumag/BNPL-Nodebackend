require("dotenv").config(); // Load environment variables from .env file
const Sequelize = require("sequelize");
// const { sequelize } = require('./models');
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || "5432",
  database: process.env.DB_NAME || "BNPL",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "nana@123",
  dialect: "postgres", // Replace with your database dialect (e.g., 'mysql', 'postgres', 'sqlite')
  // Add any other Sequelize configurations as needed
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Drop and Re sync the database!");
//     // initial();
//   })
//   .catch((error) => {
//     console.error("Unable to create user table : ", error);
//   });

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Drop and Re sync the database!");
//     // initial();
//   })
//   .catch((error) => {
//     console.error("Unable to create user table : ", error);
//   });

testConnection();

module.exports = sequelize;
