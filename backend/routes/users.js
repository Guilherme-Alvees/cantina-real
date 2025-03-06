const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Rota para listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

module.exports = router;
