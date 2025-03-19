import pool from "../config/db.js";

export const editOneProduct = async (req, res) => {
  const { id } = req.params;
  let { nome, descricao, quantidade, valor, categoria } = req.body;

  try {
    // Se algum campo não for enviado, definimos como null (para evitar erro de tipo)
    quantidade = quantidade !== undefined ? Number(quantidade) : null;
    valor = valor !== undefined ? Number(valor) : null;

    // Verifica se o produto existe
    const produtoExistente = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Query corrigida: agora passamos valores com tipos bem definidos
    const query = `
      UPDATE products
      SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        quantidade = COALESCE($3::integer, quantidade),
        valor = COALESCE($4::numeric, valor),
        categoria = COALESCE($5, categoria)
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      nome || null,
      descricao || null,
      quantidade,
      valor,
      categoria || null,
      id,
    ];

    const resultado = await pool.query(query, values);

    res.status(200).json({
      message: "Produto atualizado com sucesso.",
      produto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

export const deleteOneProduct = async (req, res) => {
  const { id } = req.params; // Obtém o ID do produto da URL

  try {
    // Verifica se o produto existe
    const produtoExistente = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Deleta o produto
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: "Produto deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
};

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
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    if (typeof nome !== "string" || typeof descricao !== "string") {
      return res
        .status(400)
        .json({ error: "Nome e descrição devem ser textos." });
    }

    if (!["bebidas", "comida"].includes(categoria)) {
      return res
        .status(400)
        .json({ error: "Categoria inválida. Use 'bebidas' ou 'comida'." });
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      return res
        .status(400)
        .json({ error: "Quantidade deve ser um número inteiro positivo." });
    }

    if (isNaN(valor) || valor <= 0) {
      return res
        .status(400)
        .json({ error: "Valor deve ser um número maior que zero." });
    }

    const query = `
      INSERT INTO products (nome, descricao, quantidade, valor, categoria)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [nome, descricao, quantidade, valor, categoria];

    const { rows } = await pool.query(query, values);

    return res
      .status(201)
      .json({ message: "Produto cadastrado com sucesso!", produto: rows[0] });
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const foodsAndDrinks = async (_, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id AS id_product, nome, descricao, valor, categoria, quantidade
      FROM products
      WHERE categoria IN ('comida', 'bebidas')
    `);

    const products = {
      comidas: rows.filter((item) => item.categoria === "comida"),
      bebidas: rows.filter((item) => item.categoria === "bebidas"),
    };

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
