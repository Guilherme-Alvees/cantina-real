import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { getFoodAndDrinks, sendOrder } from "../../axios";
import { useNavigate } from "react-router-dom";

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
  CircularProgress,
  Snackbar,
  Alert,
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
  const [openCard, setOpenCard] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userIdJson = localStorage.getItem("user");
  const id_user = userIdJson ? JSON.parse(userIdJson).id : null;

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

  const closeWpp = () => {
    setOpenSuccessDialog(false);
    navigate("/pedidos-route");
  };

  const handlePagar = async () => {
    if (!id_user) {
      setError("Usuário não autenticado. Por favor, faça login.");
      return;
    }

    setLoading(true);

    // Mapeia os itens selecionados para o formato esperado pela API
    const items = Object.keys(selectedItems)
      .map((name) => {
        const product = [...products.comidas, ...products.bebidas].find(
          (p) => p.nome === name
        );

        if (!product) {
          console.error(`Produto "${name}" não encontrado.`);
          return null;
        }

        return {
          id_product: product.id_product,
          nome_produto: product.nome,
          quantidade: selectedItems[name],
          valor_unitario: parseFloat(product.valor),
        };
      })
      .filter(Boolean); // Remove itens nulos (caso algum produto não seja encontrado)

    console.log(products);

    // 🔥 Mostra o corpo da requisição no console antes de enviá-la
    const requestBody = {
      id_user,
      items,
    };

    console.log(
      "🛒 Corpo da requisição a ser enviada:",
      JSON.stringify(requestBody, null, 2)
    );

    try {
      const response = await sendOrder(requestBody);

      if (response.status === 201) {
        console.log("✅ Pedido criado com sucesso!", response.data);
        setOpenCard(false);
        setOpenSuccessDialog(true);
        setSelectedItems({});
      }
    } catch (error) {
      console.error(
        "❌ Erro ao enviar pedido:",
        error.response ? error.response.data : error.message
      );
      setError("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
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
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 8 }}>
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
          border: "solid 1px green",
          borderRadius: "5px",
          m: 2,
          p: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
          Total:
        </Typography>
        <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
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
          disabled={calculateTotal() === "0.00" || loading}
        >
          {loading ? <CircularProgress size={24} /> : "CONFIRMAR COMPRA"}
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  border: "solid 1px green",
                  p: 1,
                  borderRadius: "5px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  R$ {calculateTotal()}
                </Typography>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={handlePagar}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Pagar"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSuccessDialog}
          onClose={closeWpp}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            borderRadius: 3, // Bordas arredondadas
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Sombra suave
          }}
        >
          {/* Título */}
          <DialogTitle id="alert-dialog-title">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1, // Espaçamento entre o texto e o ícone
              }}
            >
              Confira seu WhatsApp
              <WhatsAppIcon sx={{ color: "#25D366", fontSize: 32 }} />{" "}
            </Typography>
          </DialogTitle>

          {/* Conteúdo */}
          <DialogContent>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              Seu pedido foi confirmado com sucesso! Em instantes, você receberá
              uma mensagem no WhatsApp com os detalhes.
            </Typography>
          </DialogContent>

          {/* Ações (Imagem e Botão) */}
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2, // Espaçamento entre a imagem e o botão
              padding: 3, // Espaçamento interno
            }}
          >
            {/* Imagem */}
            <Box
              sx={{
                width: 120, // Largura da imagem
                height: 120, // Altura da imagem
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/img-check.png"
                alt="Ícone de confirmação"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Botão */}
            <Button
              onClick={closeWpp}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1976D2", // Cor do botão
                "&:hover": {
                  backgroundColor: "#1565C0", // Cor do botão ao passar o mouse
                },
                padding: "10px 24px", // Espaçamento interno
                fontSize: "1rem", // Tamanho da fonte
                fontWeight: "bold", // Texto em negrito
                textTransform: "none", // Remove a transformação de texto para maiúsculas
              }}
            >
              Voltar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
