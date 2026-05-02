// connection.js
import mysql from "mysql2/promise";

const DB = await mysql.createConnection({
  host: "localhost",
  user: "root", // XAMPP default
  password: "",
  database: "api_practice",
});

// console.log("✅ Connected to SQL database!");

export default DB;
