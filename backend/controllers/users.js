import pool from "../config/db.js";

export const getAllUsers = async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const postNewUser = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const query = `
      INSERT INTO users (nome, email, telefone, senha)
      VALUES ($1, $2, $3, $4) RETURNING *`; // Removido o $5 extra

    const values = [nome, email, telefone, senha];

    const { rows } = await pool.query(query, values);
    return res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso!", user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios!" });
  }

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const user = rows[0];

    if (user.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    delete user.senha;

    return res
      .status(200)
      .json({ message: "Login realizado com sucesso!", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10); // Converte para número
  const { nome, email, telefone, senha } = req.body;

  if (!id || !nome || !email || !telefone || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: `Usuário com ID ${id} não encontrado!` });
    }

    const query = `
      UPDATE users
      SET nome = $1, email = $2, telefone = $3, senha = $4
      WHERE id = $5
      RETURNING *`;
    
    const values = [nome, email, telefone, senha, id];
    const { rows } = await pool.query(query, values);

    return res.status(200).json({ message: "Usuário atualizado com sucesso!", user: rows[0] });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return res.status(500).json({ error: "Erro interno no servidor. Tente novamente mais tarde." });
  }
};
