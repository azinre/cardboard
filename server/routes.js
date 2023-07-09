const express = require("express");
const router = express.Router();
const pool = require("./db");

// User Registration
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});



// User Routes //
// Create a user
router.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    // if (user.rows.length === 0) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updateUser = await pool.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE user_id = $4",
      [username, email, password, id]
    );
    res.json("User was updated!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User was deleted!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Cardboard Routes //


router.post("/cardboards", async (req, res) => {
    try {
      const { title, occasion, recipient, creator_id, is_archived, is_favorite, schedule } = req.body;
      const newCardboard = await pool.query(
        "INSERT INTO cardboards (title, occasion, recipient, creator_id, is_archived, is_favorite, schedule) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [title, occasion, recipient, creator_id, is_archived, is_favorite, schedule]
      );
      res.json(newCardboard.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  router.get("/cardboards", async (req, res) => {
    try {
      const allCardboards = await pool.query("SELECT * FROM cardboards");
      res.json(allCardboards.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  router.get("/cardboards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cardboard = await pool.query("SELECT * FROM cardboards WHERE cardboard_id = $1", [id]);
      if (cardboard.rows.length === 0) {
        return res.status(404).json({ error: "Cardboard not found" });
      }
      res.json(cardboard.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  router.put("/cardboards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, occasion, recipient, creator_id, is_archived, is_favorite, schedule } = req.body;
      const updateCardboard = await pool.query(
        "UPDATE cardboards SET title = $1, occasion = $2, recipient = $3, creator_id = $4, is_archived = $5, is_favorite = $6, schedule = $7 WHERE cardboard_id = $8",
        [title, occasion, recipient, creator_id, is_archived, is_favorite, schedule, id]
      );
      res.json("Cardboard was updated!");
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  router.delete("/cardboards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteCardboard = await pool.query("DELETE FROM cardboards WHERE cardboard_id = $1", [id]);
      res.json("Cardboard was deleted!");
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
module.exports = router;

  
  
  
  
  
  
  