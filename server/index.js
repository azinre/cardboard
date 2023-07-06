const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json()); 

// ROUTES

// Create a cartboard
app.post("/cartboards", async (req, res) => {
  try {
    const { description } = req.body;
    const newCartboard = await pool.query(
      "INSERT INTO cartboards (description) VALUES ($1) RETURNING *",
      [description]
    );

    res.json(newCartboard.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all cartboards
app.get("/cartboards", async (req, res) => {
  try {
    const allCartboards = await pool.query("SELECT * FROM cartboards");
    res.json(allCartboards.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific cartboard
app.get("/cartboards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cartboard = await pool.query("SELECT * FROM cartboards WHERE id = $1", [id]);

    // if (cartboard.rows.length === 0) {
    //   return res.status(404).json({ error: "Cartboard not found" });
    // }

    res.json(cartboard.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a cartboard
app.put("/cartboards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatedCartboard = await pool.query(
      "UPDATE cartboards SET description = $1 WHERE id = $2 RETURNING *",
      [description, id]
    );

    if (updatedCartboard.rows.length === 0) {
      return res.status(404).json({ error: "Cartboard not found" });
    }

    res.json(updatedCartboard.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a cartboard
app.delete("/cartboards/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCartboard = await pool.query("DELETE FROM cartboards WHERE id = $1 RETURNING *", [id]);

    if (deletedCartboard.rows.length === 0) {
      return res.status(404).json({ error: "Cartboard not found" });
    }

    res.json(deletedCartboard.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server has started on port 5000");
});
