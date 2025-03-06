require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./config/db");
const userRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
