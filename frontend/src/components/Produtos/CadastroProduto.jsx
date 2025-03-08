import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewProduct } from "../../axios";
import Navbar from "../Navbar/Navbar";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

const CadastroProduto = () => {
  const navigate = useNavigate();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  
  const [productData, setProductData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    quantidade: "",
    valor: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleValorChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    let formattedValue = (parseInt(rawValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setProductData({ ...productData, valor: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!productData.nome || !productData.descricao || !productData.categoria || !productData.quantidade || !productData.valor) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
  
    const quantidade = parseInt(productData.quantidade);
    const valor = parseFloat(productData.valor.replace("R$", "").replace(",", ".").trim());
  
    if (quantidade <= 0 || isNaN(quantidade)) {
      setError("A quantidade deve ser um número inteiro positivo.");
      return;
    }
  
    if (valor <= 0 || isNaN(valor)) {
      setError("O valor deve ser um número maior que zero.");
      return;
    }
  
    setError("");
    setOpenLoad(true);
  
    try {
      await registerNewProduct({
        ...productData,
        quantidade,
        valor,
      });
  
      setOpenSnackBar(true);
      setProductData({ nome: "", descricao: "", categoria: "", quantidade: "", valor: "" });
  
      setTimeout(() => {
        navigate("/estoque-route");
      }, 2000);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      console.log("Resposta da API:", err.response?.data);
      setError(err.response?.data?.message || "Erro ao cadastrar o produto");
    } finally {
      setOpenLoad(false);
    }
  };

  const handleClose = () => {
    setOpenSnackBar(false);
    setOpenLoad(false);
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Navbar />
      <Container maxWidth="sm">
        <IconButton onClick={() => navigate("/estoque-route")} color="inherit">
          <ArrowBackIcon />
          <Typography sx={{ textAlign: "left", ml: 1 }}>Voltar</Typography>
        </IconButton>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", color: "green", p: 2, fontSize: 24 }}
        >
          Cadastro de Produtos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
          <TextField label="Nome do Produto" name="nome" value={productData.nome} onChange={handleChange} fullWidth required />
          <TextField label="Descrição" name="descricao" value={productData.descricao} onChange={handleChange} fullWidth required />
          <FormControl fullWidth required>
            <InputLabel>Categoria</InputLabel>
            <Select name="categoria" value={productData.categoria} onChange={handleChange}>
              <MenuItem value="bebidas">Bebidas</MenuItem>
              <MenuItem value="comida">Comida</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Quantidade" name="quantidade" type="number" value={productData.quantidade} onChange={handleChange} fullWidth required />
          <TextField label="Valor (uni)" name="valor" value={productData.valor} onChange={handleValorChange} fullWidth required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 5,fontWeight: "bold"}}>
            Cadastrar
          </Button>
        </Box>

        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openLoad}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar open={openSnackBar} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            Produto cadastrado com sucesso!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CadastroProduto;
