const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const bcrypt = require("bcryptjs");

// Configuração do multer para armazenamento de arquivos (imagem)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Cadastro de Usuário
router.post("/", upload.single("img_user"), async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  const img_user = req.file ? req.file.buffer : null; // Se houver imagem, pega o buffer

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    // Criptografando a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Inserir dados no banco
    const query = `
      INSERT INTO users (nome, email, telefone, senha, img_user)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_user, nome, email, telefone, img_user;
    `;
    const values = [nome, email, telefone, hashedPassword, img_user];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

module.exports = router;
