import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PedidoTable from "./PedidosTable";
import Box from "@mui/material/Box";
import Navbar from "../Navbar/Navbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

const pedidos = [
  {
    "dataPedido": "29/01/2025",
    "pedidos": [
      { "nome": "Água", "descricao": "Garrafa-350 ml", "quantidade": 3, "valor": 15.0 },
      { "nome": "Espetinho", "descricao": "Carne", "quantidade": 1, "valor": 8.0 },
      { "nome": "Coca Cola", "descricao": "Latinha-350 ml", "quantidade": 3, "valor": 15.0 }
    ]
  },
  {
    "dataPedido": "31/01/2025",
    "pedidos": [
      { "nome": "Água", "descricao": "Garrafa-350 ml", "quantidade": 3, "valor": 15.0 }
    ]
  },
  {
    "dataPedido": "02/02/2025",
    "pedidos": [
      { "nome": "Água", "descricao": "Garrafa-350 ml", "quantidade": 2, "valor": 15.0 }
    ]
  },
  {
    "dataPedido": "09/02/2025",
    "pedidos": [
      { "nome": "Água", "descricao": "Garrafa-350 ml", "quantidade": 2, "valor": 15.0 }
    ]
  }
];

const Perfil = () => {
  const [pedidoData, setPedidoData] = useState(pedidos[0]); // Definir um estado inicial válido
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://minhaapi.com/pedidos/123"); // Exemplo de endpoint
        if (!response.ok) throw new Error("Erro ao buscar os pedidos");
        const data = await response.json();
        setPedidoData(data);
      } catch (error) {
        console.error("Erro ao carregar os pedidos:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goToPedidos = () => {
    navigate("/pedidos-route");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ mt: 9, px: 2 }}>
        <IconButton onClick={goToPedidos} color="inherit">
          <ArrowBackIcon />
        </IconButton>
        {pedidoData ? (
          <PedidoTable dataPedido={pedidoData.dataPedido} pedidos={pedidoData.pedidos} />
        ) : (
          <p>Carregando...</p>
        )}
      </Box>

      {/* Barra de navegação fixa no final da tela */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          bgcolor: "background.paper",
          boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Navegação de Perfil"
        >
          <Tab icon={<ManageAccountsIcon />} label="Editar Perfil" />
          <Tab icon={<ReceiptLongIcon />} label="Gerar Extrato" />
          <Tab icon={<InventoryIcon />} label="Estoque" />
          <Tab icon={<EqualizerIcon />} label="Dashboard" />
          <Tab icon={<PeopleAltIcon />} label="Usuários" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Perfil;
