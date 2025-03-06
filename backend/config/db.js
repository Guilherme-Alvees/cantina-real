require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Necessário para Neon Tech
  },
});

pool
  .connect()
  .then(() => console.log("🟢 Conectado ao PostgreSQL"))
  .catch((err) => console.error("🔴 Erro ao conectar ao DB", err));

module.exports = pool;
