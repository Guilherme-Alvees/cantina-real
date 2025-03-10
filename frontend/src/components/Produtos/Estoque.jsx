import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  deleteOneProduct,
  editOneProduct,
  registerNewProduct,
} from "../../axios";

import Box from "@mui/material/Box";
import Navbar from "../Navbar/Navbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Estoque = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openCardTrash, setOpenCardTrash] = useState(false);
  const [openCardEdit, setOpenCardEdit] = useState(false);
  const [openCardNewProduct, setOpenCardNewProduct] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productToEdit, setProductToEdit] = useState({
    nome: "",
    descricao: "",
    quantidade: 0,
    valor: 0,
    categoria: "",
  });
  const [newProduct, setNewProduct] = useState({
    nome: "",
    descricao: "",
    quantidade: 0,
    valor: 0,
    categoria: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" ou "error"

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setSnackbarMessage("Erro ao buscar produtos.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para abrir o diálogo de exclusão
  const handleClickOpenCardTrash = (id) => {
    setProductId(id);
    setOpenCardTrash(true);
  };

  // Função para abrir o diálogo de edição
  const handleClickOpenCardEdit = (product) => {
    setProductId(product.id);
    setProductToEdit(product);
    setOpenCardEdit(true);
  };

  // Função para abrir o diálogo de cadastro
  const handleClickOpenCardNewProduct = () => {
    setOpenCardNewProduct(true);
  };

  // Função para fechar o diálogo de exclusão
  const handleCloseCardTrash = () => {
    setOpenCardTrash(false);
    setProductId(null);
  };

  // Função para fechar o diálogo de edição
  const handleCloseCardEdit = () => {
    setOpenCardEdit(false);
    setProductId(null);
    setProductToEdit({
      nome: "",
      descricao: "",
      quantidade: 0,
      valor: 0,
      categoria: "",
    });
  };

  // Função para fechar o diálogo de cadastro
  const handleCloseCardNewProduct = () => {
    setOpenCardNewProduct(false);
    setNewProduct({
      nome: "",
      descricao: "",
      quantidade: 0,
      valor: 0,
      categoria: "",
    });
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (productId) {
      try {
        await deleteOneProduct(productId);
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        setProducts(updatedProducts);
        handleCloseCardTrash();
        setSnackbarMessage("Produto deletado com sucesso!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        setSnackbarMessage("Erro ao deletar produto.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // Função para editar o produto
  const handleEditProduct = async () => {
    if (productId) {
      try {
        const updatedProduct = await editOneProduct(productId, productToEdit);
        const updatedProducts = products.map((product) =>
          product.id === productId ? updatedProduct : product
        );
        setProducts(updatedProducts);
        handleCloseCardEdit();
        setSnackbarMessage("Produto editado com sucesso!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Erro ao editar produto:", error);
        setSnackbarMessage("Erro ao editar produto.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // Função para cadastrar um novo produto
  const handleCreateProduct = async () => {
    try {
      // Validação dos campos
      if (
        !newProduct.nome ||
        !newProduct.descricao ||
        !newProduct.quantidade ||
        !newProduct.valor ||
        !newProduct.categoria
      ) {
        setSnackbarMessage("Todos os campos são obrigatórios.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (newProduct.quantidade < 0) {
        setSnackbarMessage("A quantidade deve ser um número positivo.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (newProduct.valor <= 0) {
        setSnackbarMessage("O valor deve ser maior que zero.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Remove a formatação do valor (ex.: "R$ 5,00" -> 500)
      const valorEmCentavos = parseInt(
        newProduct.valor.replace(/\D/g, ""), // Remove tudo que não é número
        10
      );

      // Prepara os dados para enviar ao backend
      const productData = {
        ...newProduct,
        valor: valorEmCentavos, // Envia o valor em centavos
      };

      // Exibe o corpo da requisição no console
      console.log("Corpo da requisição:", productData);

      const createdProduct = await registerNewProduct(productData);
      setProducts([...products, createdProduct]);
      handleCloseCardNewProduct();
      setSnackbarMessage("Produto cadastrado com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setSnackbarMessage("Erro ao cadastrar produto. Verifique os dados.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Função para formatar o valor em "R$"
  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    // Converte o valor para reais e formata como moeda
    const numericValue = parseFloat(value).toFixed(2);
    return Number(numericValue).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para fechar o Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Navbar />
      <Box sx={{ mt: 9 }}>
        <IconButton onClick={() => navigate("/perfil-route")} color="inherit">
          <ArrowBackIcon />
          <Typography sx={{ textAlign: "left" }}>Voltar</Typography>
        </IconButton>
        <Typography
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "green",
          }}
        >
          Controle de Estoque
        </Typography>
      </Box>

      {/* Tabela de produtos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Nome</strong>
              </TableCell>
              <TableCell>
                <strong>Descrição</strong>
              </TableCell>
              <TableCell>
                <strong>Valor (uni)</strong>
              </TableCell>
              <TableCell>
                <strong>Qtd</strong>
              </TableCell>
              <TableCell>
                <strong>Excluir</strong>
              </TableCell>
              <TableCell>
                <strong>Editar</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nome}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>{formatCurrency(product.valor)}</TableCell>
                <TableCell>{product.quantidade}x</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleClickOpenCardTrash(product.id)}
                    color="primary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleClickOpenCardEdit(product)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={openCardTrash}
        onClose={handleCloseCardTrash}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir este produto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCardTrash}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Edição do Produto Selecionado */}
      <Dialog
        open={openCardEdit}
        onClose={handleCloseCardEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Editar Produto"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                label="Nome"
                name="nome"
                value={productToEdit.nome}
                onChange={(e) =>
                  setProductToEdit({ ...productToEdit, nome: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Descrição"
                name="descricao"
                value={productToEdit.descricao}
                onChange={(e) =>
                  setProductToEdit({
                    ...productToEdit,
                    descricao: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Quantidade"
                name="quantidade"
                type="number"
                value={productToEdit.quantidade}
                onChange={(e) =>
                  setProductToEdit({
                    ...productToEdit,
                    quantidade: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Valor"
                name="valor"
                value={formatCurrency(productToEdit.valor)}
                onChange={(e) => {
                  const valorEmCentavos = e.target.value.replace(/\D/g, "");
                  setProductToEdit({
                    ...productToEdit,
                    valor: valorEmCentavos,
                  });
                }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="categoria"
                  value={productToEdit.categoria}
                  onChange={(e) =>
                    setProductToEdit({
                      ...productToEdit,
                      categoria: e.target.value,
                    })
                  }
                  label="Categoria"
                >
                  <MenuItem value="comida">Comida</MenuItem>
                  <MenuItem value="bebidas">Bebidas</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCardEdit}>Cancelar</Button>
          <Button onClick={handleEditProduct} color="primary" autoFocus>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Cadastro de Produto */}
      <Dialog
        open={openCardNewProduct}
        onClose={handleCloseCardNewProduct}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cadastrar Produto"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                label="Nome"
                name="nome"
                value={newProduct.nome}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nome: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Descrição"
                name="descricao"
                value={newProduct.descricao}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, descricao: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Quantidade"
                name="quantidade"
                type="number"
                value={newProduct.quantidade}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantidade: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Valor"
                name="valor"
                value={formatCurrency(newProduct.valor)}
                onChange={(e) => {
                  // Remove tudo que não for número
                  const valorEmCentavos = e.target.value.replace(/\D/g, "");

                  // Garante que há um número válido
                  const valorFinal = valorEmCentavos
                    ? (parseInt(valorEmCentavos, 10) / 100).toFixed(2)
                    : "0.00";

                  // Atualiza o estado com o valor correto para a API
                  setNewProduct({ ...newProduct, valor: valorFinal });

                  // Exibe no console o valor formatado corretamente
                  console.log("Valor salvo:", valorFinal);
                }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="categoria"
                  value={newProduct.categoria}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoria: e.target.value })
                  }
                  label="Categoria"
                >
                  <MenuItem value="comida">Comida</MenuItem>
                  <MenuItem value="bebidas">Bebidas</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCardNewProduct}>Cancelar</Button>
          <Button onClick={handleCreateProduct} color="primary" autoFocus>
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botão de Cadastro de Produto */}
      <Box
        sx={{
          position: "fixed",
          bottom: 5,
          right: 5,
          padding: 2,
        }}
      >
        <IconButton onClick={handleClickOpenCardNewProduct} color="primary">
          <AddCircleIcon
            sx={{ fontSize: "4rem", bgcolor: "white", borderRadius: "50%" }}
          />
        </IconButton>
      </Box>

      {/* Snackbar para mensagens de sucesso ou erro */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Estoque;
