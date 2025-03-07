import pool from "../config/db.js";

export const getLastThreeOrders = async (req, res) => {
  const { id_user } = req.params; // Pega o ID do usuário da URL

  try {
    // Consulta SQL para obter as 3 últimas datas distintas em que o usuário fez pedidos
    const datesQuery = `
      SELECT DISTINCT DATE(data_pedido) as data_pedido
      FROM orders
      WHERE id_user = $1
      ORDER BY data_pedido DESC
      LIMIT 3
    `;
    const { rows: dateRows } = await pool.query(datesQuery, [id_user]);

    // Se não houver pedidos, retorna um array vazio
    if (dateRows.length === 0) {
      return res.json([]);
    }

    // Extraindo as datas para consulta
    const orderDates = dateRows.map(row => row.data_pedido.toISOString().split("T")[0]);

    // Consulta SQL para buscar os produtos de cada data
    const ordersQuery = `
      SELECT 
        DATE(o.data_pedido) as data_pedido,
        p.nome,
        p.descricao,
        oi.quantidade,
        oi.valor_total
      FROM order_items oi
      JOIN orders o ON oi.id_pedido = o.id_pedido
      JOIN products p ON oi.id_product = p.id
      WHERE o.id_user = $1 AND DATE(o.data_pedido) IN (${orderDates.map((_, i) => `$${i + 2}`).join(",")})
      ORDER BY o.data_pedido DESC
    `;

    const { rows: orders } = await pool.query(ordersQuery, [id_user, ...orderDates]);

    // Organizando os pedidos por data
    const pedidosFormatados = dateRows.map(({ data_pedido }) => {
      return {
        dataPedido: new Intl.DateTimeFormat("pt-BR").format(new Date(data_pedido)), // Formata a data corretamente
        pedidos: orders
          .filter(order => order.data_pedido.toISOString().split("T")[0] === data_pedido.toISOString().split("T")[0])
          .map(({ nome, descricao, quantidade, valor_total }) => ({
            nome,
            descricao,
            quantidade,
            valor: Number(valor_total), // Converte para número
          })),
      };
    });

    return res.json(pedidosFormatados);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
