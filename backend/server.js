const express = require("express");
const cors = require('cors');
const { Pool } = require('pg'); 
const port = process.env.PORT || 3001;
const routes = require("./routes/index");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// IMPORTANT FIX: Expose database pool BEFORE mounting routes
app.set('db', pool); 

// Now mount routes safely
app.use("/api", routes);

// Create the SQL table matching your original todo schema fields
pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    is_complete BOOLEAN DEFAULT false,
    due_date TIMESTAMP
  );
`).then(() => console.log("PostgreSQL Todos Table is perfectly configured!"))
  .catch(err => console.error("Table creation error:", err));

app.listen(port, () => {
  console.log("Server is successfully listening on port:", port);
});
