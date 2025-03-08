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
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const Perfil = () => {
  const [pedidoData, setPedidoData] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
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
      } finally {
        setLoading(false); // Quando termina a requisição, tira o loading
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
    <Box sx={{ minHeight: "100vh", pb: 8 }}> 
      <Navbar />
      <Box sx={{ mt: 8}}>
        <IconButton onClick={goToPedidos} color="inherit">
          <ArrowBackIcon /><Typography
        sx={{
          textAlign: "left",
        }}
      >
        Voltar
      </Typography>
        </IconButton>

        {loading && (
          <Box sx={{ justifyContent: "center", display: "flex", mt: "50%" }}>
            <CircularProgress />
          </Box>
        )}
          
          <Box sx={{ p: 1 }}>
  {!loading && pedidoData.length > 0 && (
    <>
      <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "green"
        }}
      >
        Histórico de Pedidos
      </Typography>
      {pedidoData.map((pedido, index) => (
        <PedidoTable key={index} dataPedido={pedido.dataPedido} pedidos={pedido.pedidos} />
      ))}
    </>
  )}
</Box>

        {!loading && pedidoData.length === 0 && (
          <Card sx={{ minWidth: 275, mt: 5, textAlign: "center", p: 2 }}>
            <CardContent>
              <FastfoodIcon sx={{ fontSize: 50, color: "gray" }} />
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                Você ainda não tem nenhum pedido em nossa cantina.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button variant="contained" color="primary" onClick={() => navigate("/pedidos-route")}>
                Pedir agora
              </Button>
            </CardActions>
          </Card>
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
