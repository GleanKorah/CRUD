// Import dependencies
const db = require("./db");
const express = require("express");
const bodyParser = require("body-parser");

// Create Express app
const app = express();
app.use(bodyParser.json());

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all students
// app.get("/students", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM students");
//     res.status(200).json({
//       status: "succes",
//       data: result.rows,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/students", async (req, res) => {
  try {
    const allStudent = await prisma.students.findMany();
    console.log(allStudent);
    res.status(200).json({
      status: "success",
      data: allStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Insert a new student
// app.post("/students", async (req, res) => {
//   const { name, address } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT into students (name, address) values ($1, $2) RETURNING *",
//       [name, address]
//     );
//     res.status(200).json({
//       status: "Insert succes",
//       data: result.rows,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  try {
    await prisma.students.create({
      data: {
        name: name,
        address: address,
      },
    });
    res.status(200).json({
      status: "success",
      message: "data berhasil dimasukan",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update an existing student
// app.put("/students/:id", async (req, res) => {
//   const id = req.params.id;
//   const { name, address } = req.body;
//   try {
//     const result = await pool.query(
//       "UPDATE students SET name = $1, address = $2 WHERE id = $3 RETURNING *",
//       [name, address, id]
//     );
//     res.status(200).json({
//       status: "Update succes",
//       data: result.rows,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const { name, address } = req.body;
  try {
    // const result = await pool.query(
    //   "UPDATE students SET name = $1, address = $2 WHERE id = $3 RETURNING *",
    //   [name, address, id]
    //  );

    await prisma.students.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        address: address,
      },
    });

    res.status(200).json({
      status: "Update succes",
      //data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a student
// app.delete("/students/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     await pool.query("DELETE FROM students WHERE id=$1", [id]);
//     res.status(200).json({
//       status: "Delete succes",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.students.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      status: "Delete succes",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a student by ID
// app.get("/students/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await pool.query("SELECT * FROM students WHERE id=$1", [id]);
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);
//     } else {
//       res.status(404).send("Student not found");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      status: "Data Ditemukan",
      Data: result,
    });
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
