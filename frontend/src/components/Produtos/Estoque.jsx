import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  deleteOneProduct,
  editOneProduct,
  registerNewProduct,
} from "../../axios";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AddCircle, Edit, Delete, ArrowBack } from "@mui/icons-material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Navbar from "../Navbar/Navbar";

const Estoque = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    quantidade: "", // Inicializado como string vazia
    valor: "",
    categoria: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setSnackbarMessage("Erro ao buscar produtos");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        nome: product.nome,
        descricao: product.descricao,
        quantidade: product.quantidade.toString(), // Convertido para string
        valor: (product.valor * 100).toString(), // Converte para centavos
        categoria: product.categoria,
      });
      setSelectedProduct(product);
      setIsEditing(true);
    } else {
      setFormData({
        nome: "",
        descricao: "",
        quantidade: "", // String vazia
        valor: "", // String vazia
        categoria: "",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteOneProduct(selectedProduct.id);
      fetchProducts();
      setSnackbarMessage("Produto excluído com sucesso");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setSnackbarMessage("Erro ao excluir produto");
      setSnackbarOpen(true);
    }
    handleCloseDeleteDialog();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleValorChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    setFormData({ ...formData, valor });
  };

  const formatValorDisplay = (valor) => {
    if (!valor) return "";
    const valorEmReais = (parseFloat(valor) / 100).toFixed(2).replace(".", ",");
    return `${valorEmReais}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de carregamento

    const valorFormatado = formData.valor
      ? (parseFloat(formData.valor) / 100).toFixed(2)
      : null;
    const quantidadeInteira = parseInt(formData.quantidade, 10);

    const productData = {
      nome: formData.nome,
      descricao: formData.descricao,
      quantidade: quantidadeInteira,
      valor: valorFormatado,
      categoria: formData.categoria,
    };

    try {
      if (isEditing) {
        await editOneProduct(selectedProduct.id, productData);
        setSnackbarMessage("Produto atualizado com sucesso");
      } else {
        await registerNewProduct(productData);
        setSnackbarMessage("Produto cadastrado com sucesso");
      }
      fetchProducts();
      setOpenDialog(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setSnackbarMessage("Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Navbar />
      <Box sx={{ mt: 9, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/perfil-route")}>
          <ArrowBack />
        </IconButton>
        <Typography
          sx={{
            fontWeight: "bold",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          Controle de Estoque
        </Typography>
        <IconButton onClick={reloadPage}>
          <AutorenewIcon sx={{ mr: "5px", color: "green" }} />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Deletar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nome}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  R${product.valor}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {product.quantidade}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(product)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDeleteDialog(product)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <IconButton color="primary" onClick={() => handleOpenDialog()}>
          <AddCircle
            sx={{ fontSize: 50, bgcolor: "white", borderRadius: "50%" }}
          />
        </IconButton>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditing ? "Editar Produto" : "Cadastrar Produto"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleFormChange}
              required
            />
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Valor</InputLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">R$</InputAdornment>
                }
                label="Valor"
                name="valor"
                value={formatValorDisplay(formData.valor)}
                onChange={handleValorChange}
                required
              />
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleFormChange} // Adicionado aqui
              required
              inputProps={{ min: 0 }} // Garante que o valor seja positivo
            />
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                label="Categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleFormChange}
                required
              >
                <MenuItem value="bebidas">Bebidas</MenuItem>
                <MenuItem value="comida">Comida</MenuItem>
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="error">
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Salvar"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Deseja mesmo excluir esse produto?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteProduct} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("Erro") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Estoque;
