import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { getFoodAndDrinks, sendOrder } from "../../axios";
import { useNavigate } from "react-router-dom"; // Importe useNavigate para redirecionar o usuário

import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import LiquorIcon from "@mui/icons-material/Liquor";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Pedidos() {
  const [value, setValue] = useState(0);
  const [products, setProducts] = useState({ comidas: [], bebidas: [] });
  const [selectedItems, setSelectedItems] = useState({});
  const [openCard, setOpenCard] = React.useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false); // Estado para o diálogo de sucesso
  const navigate = useNavigate(); // Hook para navegação

  const id_user = 21; // Substitua isso pelo ID do usuário logado

  useEffect(() => {
    getFoodAndDrinks()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleQuantityChange = (name, change, stock) => {
    setSelectedItems((prev) => {
      const newCount = (prev[name] || 0) + change;
      if (newCount < 0 || newCount > stock) return prev;
      return { ...prev, [name]: newCount };
    });
  };

  const calculateTotal = () => {
    return Object.keys(selectedItems)
      .reduce((total, name) => {
        const product = [...products.comidas, ...products.bebidas].find(
          (p) => p.nome === name
        );
        return (
          total +
          (product ? parseFloat(product.valor) * selectedItems[name] : 0)
        );
      }, 0)
      .toFixed(2);
  };

  const handleCompraOk = () => {
    setOpenCard(true);
  };

  const handleClose = () => {
    setOpenCard(false);
  };

  const handlePagar = async () => {
    const items = Object.keys(selectedItems).map((name) => {
      const product = [...products.comidas, ...products.bebidas].find(
        (p) => p.nome === name
      );
      return {
        id_product: product.id,
        quantidade: selectedItems[name],
        valor_unitario: parseFloat(product.valor),
      };
    });

    try {
      const response = await sendOrder({
        id_user,
        items,
      });

      if (response.status === 201) {
        setOpenCard(false); // Fecha o diálogo de confirmação
        setOpenSuccessDialog(true); // Abre o diálogo de sucesso
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
    }
  };

  const renderTable = (items) => (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow sx={{ "& th": { padding: "6px" } }}>
            <TableCell sx={{ fontWeight: "bold" }}>Produto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Quantidade
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.nome} sx={{ "& td": { padding: "8px" } }}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>R$ {item.valor}</TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.nome, -1, item.quantidade)
                  }
                  disabled={!selectedItems[item.nome]}
                >
                  <RemoveCircleIcon
                    color={selectedItems[item.nome] ? "primary" : "disabled"}
                  />
                </IconButton>
                {selectedItems[item.nome] || 0}
                <IconButton
                  onClick={() =>
                    handleQuantityChange(item.nome, 1, item.quantidade)
                  }
                  disabled={item.quantidade === 0}
                >
                  <AddCircleIcon
                    color={item.quantidade === 0 ? "disabled" : "primary"}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Navbar />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 7 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="abas de pedidos"
        >
          <Tab icon={<LiquorIcon />} label="Bebidas" />
          <Tab icon={<LunchDiningIcon />} label="Comidas" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>
        {value === 0
          ? renderTable(products.bebidas)
          : renderTable(products.comidas)}
      </Box>
      <Box
        sx={{
          color: "green",
          display: "flex",
          justifyContent: "space-between",
          pl: 4,
          pr: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          R$ {calculateTotal()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "green",
          mt: 2,
        }}
      >
        <Button
          onClick={handleCompraOk}
          variant="contained"
          color="primary"
          disabled={calculateTotal() === "0.00"}
        >
          CONFIRMAR COMPRA
        </Button>

        <Dialog
          open={openCard}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Dados sobre a compra
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TableContainer
                component={Paper}
                sx={{ overflowX: "auto", mt: 2 }}
              >
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Valor Unitário
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Quantidade
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Subtotal
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(selectedItems).map((name) => {
                      const product = [
                        ...products.comidas,
                        ...products.bebidas,
                      ].find((p) => p.nome === name);
                      if (!product) return null;
                      return (
                        <TableRow key={name}>
                          <TableCell>{product.nome}</TableCell>
                          <TableCell>R$ {product.valor}</TableCell>
                          <TableCell>{selectedItems[name]}</TableCell>
                          <TableCell>
                            R${" "}
                            {(product.valor * selectedItems[name]).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  R$ {calculateTotal()}
                </Typography>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePagar} variant="contained" color="primary">
              Pagar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSuccessDialog}
          onClose={() => setOpenSuccessDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Confira seu WhatsApp
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <WhatsAppIcon sx={{ color: "green", fontSize: 60, mb: 2 }} />
                <Typography variant="body1">
                  Confira seu WhatsApp para concluir o pagamento.
                </Typography>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => navigate("/perfil-route")}
              variant="contained"
              color="primary"
            >
              Voltar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
