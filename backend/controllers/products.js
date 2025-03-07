import pool from "../config/db.js";

export const getAllProducts = async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
  