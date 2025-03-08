import pool from "../config/db.js";

export const getAllProducts = async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createNewProduct = async (req, res) => {
  try {
    const { nome, descricao, quantidade, valor, categoria } = req.body;

    if (!nome || !descricao || !quantidade || !valor || !categoria) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    if (typeof nome !== "string" || typeof descricao !== "string") {
      return res.status(400).json({ error: "Nome e descrição devem ser textos." });
    }

    if (!["bebidas", "comida"].includes(categoria)) {
      return res.status(400).json({ error: "Categoria inválida. Use 'bebidas' ou 'comida'." });
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      return res.status(400).json({ error: "Quantidade deve ser um número inteiro positivo." });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ error: "Valor deve ser um número maior que zero." });
    }

    const query = `
      INSERT INTO products (nome, descricao, quantidade, valor, categoria)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [nome, descricao, quantidade, valor, categoria];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({ message: "Produto cadastrado com sucesso!", produto: rows[0] });

  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
