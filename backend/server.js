import express from "express";
import cors from "cors";
import userRoutes from "./routes/routes.js"; // Importação correta no ES Module

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", userRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
});
