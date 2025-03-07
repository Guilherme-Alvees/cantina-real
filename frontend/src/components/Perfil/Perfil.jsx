import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PedidoTable from "./PedidosTable";
import { lastThreeOrders } from "../../axios";

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
import CircularProgress from '@mui/material/CircularProgress';

const Perfil = () => {
  const [pedidoData, setPedidoData] = useState([]);
  const [value, setValue] = React.useState(() => {
    return parseInt(localStorage.getItem("perfilTabIndex")) || 0;
  });

  const navigate = useNavigate();
  const userIdJson = localStorage.getItem("user");
  const userId = userIdJson ? JSON.parse(userIdJson).id : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await lastThreeOrders(userId);
        setPedidoData(response.data);
      } catch (error) {
        console.error("Erro ao carregar os pedidos:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("perfilTabIndex", newValue);
  };

  const goToPedidos = () => {
    navigate("/pedidos-route");
  };

  const goToEditarPerfil = () => {
    navigate("/editar-perfil-route");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ mt: 9, px: 2 }}>
        <IconButton onClick={goToPedidos} color="inherit">
          <ArrowBackIcon />
        </IconButton>
        {pedidoData.length > 0 ? (
          pedidoData.map((pedido, index) => (
            <PedidoTable key={index} dataPedido={pedido.dataPedido} pedidos={pedido.pedidos} />
          ))
        ) : (
          <Box sx={{ 
            justifyContent: "center", 
            display: "flex",
            mt: "50%"
             }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

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
          <Tab onClick={goToEditarPerfil} icon={<ManageAccountsIcon />} label="Editar Perfil" />
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
