const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");


app.use(cors());
app.use(express.json()); 

//ROUTES//

//create a user

app.post("/users", async (req, res) => {
  try {
    const { description } = req.body;
    const newUser = await pool.query(
      "INSERT INTO user (description) VALUES($1) RETURNING *",[description]);

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all users

app.get("/users", async (req, res) => {
  try {
    const allusers = await pool.query("SELECT * FROM user");
    
    res.json(allusers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a user

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM user WHERE user_id = $1", [id]);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a user

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateUser = await pool.query(
      "UPDATE user SET description = $1 WHERE user_id = $2", [description, id]);

    res.json("User was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a user

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM user WHERE user_id = $1", [id]);
    
    res.json("User was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5432, () => {
  console.log("server has started on port 5432");
});
