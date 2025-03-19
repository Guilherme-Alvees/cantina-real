import pool from "../config/db.js";
import { sendOrderMessage } from "../services/whatsapp.js";

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
    const orderDates = dateRows.map(
      (row) => row.data_pedido.toISOString().split("T")[0]
    );

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
      WHERE o.id_user = $1 AND DATE(o.data_pedido) IN (${orderDates
        .map((_, i) => `$${i + 2}`)
        .join(",")})
      ORDER BY o.data_pedido DESC
    `;

    const { rows: orders } = await pool.query(ordersQuery, [
      id_user,
      ...orderDates,
    ]);

    // Organizando os pedidos por data
    const pedidosFormatados = dateRows.map(({ data_pedido }) => {
      return {
        dataPedido: new Intl.DateTimeFormat("pt-BR").format(
          new Date(data_pedido)
        ), // Formata a data corretamente
        pedidos: orders
          .filter(
            (order) =>
              order.data_pedido.toISOString().split("T")[0] ===
              data_pedido.toISOString().split("T")[0]
          )
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

export const createOrder = async (req, res) => {
  const { id_user, items } = req.body;

  if (!id_user || !items || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Dados inválidos. Verifique o corpo da requisição." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Inicia uma transação

    // Obtém a data atual no formato DD/MM/YYYY
    const dataPedido = new Date().toISOString().split("T")[0]; // Retorna no formato YYYY-MM-DD

    // Insere o pedido na tabela 'orders'
    const orderQuery =
      "INSERT INTO orders (id_user, data_pedido) VALUES ($1, $2) RETURNING id_pedido";
    const { rows } = await client.query(orderQuery, [id_user, dataPedido]);
    const id_pedido = rows[0].id_pedido;

    let totalCompra = 0;
    const orderItems = []; // Para armazenar os itens do pedido com nome do produto

    for (const item of items) {
      const { id_product, quantidade, valor_unitario } = item;

      // Verifica a quantidade disponível no estoque
      const productQuery =
        "SELECT id, nome, quantidade FROM products WHERE id = $1";
      const productResult = await client.query(productQuery, [id_product]);

      if (productResult.rows.length === 0) {
        throw new Error(`Produto com ID ${id_product} não encontrado.`);
      }

      const { nome, quantidade: quantidadeDisponivel } = productResult.rows[0];

      if (quantidadeDisponivel < quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${nome}. Disponível: ${quantidadeDisponivel}`
        );
      }

      // Insere os itens do pedido
      const orderItemQuery = `
        INSERT INTO order_items (id_pedido, id_product, quantidade, valor_unitario)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(orderItemQuery, [
        id_pedido,
        id_product,
        quantidade,
        valor_unitario,
      ]);

      // Atualiza o estoque do produto
      const updateStockQuery =
        "UPDATE products SET quantidade = quantidade - $1 WHERE id = $2";
      await client.query(updateStockQuery, [quantidade, id_product]);

      totalCompra += quantidade * valor_unitario;

      // Adiciona o item ao array de itens do pedido
      orderItems.push({ nome, quantidade });
    }

    // Busca o nome e telefone do usuário
    const userQuery = "SELECT nome, telefone FROM users WHERE id = $1";
    const userResult = await client.query(userQuery, [id_user]);

    if (userResult.rows.length === 0) {
      throw new Error(`Usuário com ID ${id_user} não encontrado.`);
    }

    const { nome: nomeUsuario, telefone } = userResult.rows[0];

    await client.query("COMMIT"); // Confirma a transação

    // Enviar a mensagem automática via WhatsApp com a data do pedido
    sendOrderMessage(telefone, nomeUsuario, {
      items: orderItems,
      total: totalCompra,
      dataPedido, // Passa a data do pedido
    });

    return res.status(201).json({
      id_pedido,
      total_compra: totalCompra,
      nome_usuario: nomeUsuario,
      telefone,
      data_pedido: dataPedido,
    });
  } catch (error) {
    await client.query("ROLLBACK"); // Reverte a transação em caso de erro
    console.error("Erro ao criar pedido:", error.message);
    return res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
