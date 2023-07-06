const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1989",
  host: "localhost",
  port: 5432,
  database: "cartboard"
});

module.exports = pool;