const express = require("express");
const cors = require("cors");
const pool = require("./db");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
