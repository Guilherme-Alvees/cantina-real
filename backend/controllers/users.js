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
  const { nome, email, telefone, img_user, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const query = `
      INSERT INTO users (nome, email, telefone, img_user, senha)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const values = [nome, email, telefone, img_user, senha];

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
    // Busca o usuário pelo e-mail
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const user = rows[0];

    // Compara a senha (sem criptografia, apenas para estudo)
    if (user.senha !== senha) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    // Remove a senha da resposta
    delete user.senha;

    // Se img_user for um Buffer, converte para string
    if (user.img_user && user.img_user.type === "Buffer") {
      user.img_user = Buffer.from(user.img_user.data).toString();
    }

    // Retorna os dados sem a senha
    return res
      .status(200)
      .json({ message: "Login realizado com sucesso!", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
