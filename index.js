// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

// Create Express app
const app = express();
app.use(bodyParser.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "goethe10",
  port: 5432,
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.status(200).json({
      status: "succes",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Insert a new student
app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT into students (name, address) values ($1, $2) RETURNING *",
      [name, address]
    );
    res.status(200).json({
      status: "Insert succes",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update an existing student
app.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const { name, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE students SET name = $1, address = $2 WHERE id = $3 RETURNING *",
      [name, address, id]
    );
    res.status(200).json({
      status: "Update succes",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a student
app.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM students WHERE id=$1", [id]);
    res.status(200).json({
      status: "Delete succes",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a student by ID
app.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM students WHERE id=$1", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Student not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
