import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import pool from "../config/db.js"; // Conexão com o banco de dados

const { Client } = pkg;

// Recupera sessão do banco de dados
const getSession = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT session FROM whatsapp_session WHERE id = 1"
    );
    return result.rows.length > 0
      ? JSON.parse(result.rows[0].session)
      : undefined; // Retorna undefined se não houver sessão
  } finally {
    client.release();
  }
};

const saveSession = async (session) => {
  if (!session) {
    console.log("❌ Sessão inválida, não será salva.");
    return;
  }

  const clientDB = await pool.connect();
  try {
    await clientDB.query(
      `INSERT INTO whatsapp_session (id, session) 
       VALUES ($1, $2) 
       ON CONFLICT (id) DO UPDATE SET session = $2`,
      [1, JSON.stringify(session)]
    );
    console.log("✅ Sessão salva no banco!");
  } catch (error) {
    console.error("❌ Erro ao salvar sessão:", error);
  } finally {
    clientDB.release();
  }
};

// Configuração do WhatsApp Web.js
const client = new Client({
  puppeteer: { headless: true },
  session: await getSession(), // Restaura sessão do banco (ou undefined se não houver)
});

client.on("authenticated", (session) => {
  console.log("✅ Sessão autenticada!");
  saveSession(session); // Salva sessão no banco
});

client.on("qr", (qr) => {
  console.log("📌 Escaneie o QR Code:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("🚀 WhatsApp conectado!");
});

client.initialize();

// Função para enviar mensagem de pedido
export const sendOrderMessage = async (
  telefone,
  nome,
  { items, total, dataPedido }
) => {
  let message = `Olá ${nome}, sou o Guilherme do NRD, seu pedido foi realizado! Por favor, faça o pagamento para a seguinte chave Pix: tes.realezadivina@udv.org.br da nossa cantina do Núcleo Realeza Divina.\n\n`;

  message += `📅 *Data do Pedido:* ${dataPedido}\n\n`;
  message += "📌 *Dados do Pedido:*\n";

  items.forEach((item) => {
    message += `📦 ${item.quantidade} x ${item.nome}\n`;
  });

  message += `\n💰 *Total:* R$ ${total.toFixed(2)}`;

  try {
    await client.sendMessage(`${telefone}@c.us`, message);
    console.log(`📨 Mensagem enviada para ${telefone}`);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};
