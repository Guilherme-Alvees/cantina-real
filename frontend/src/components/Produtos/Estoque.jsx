import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../axios";

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

const Estoque = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Navbar />
      <Box sx={{ mt: 9 }}>
        <IconButton onClick={() => navigate("/perfil-route")} color="inherit">
        <ArrowBackIcon /><Typography sx={{textAlign: "left"}}>Voltar</Typography>
        </IconButton>
        <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "green"
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
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell><strong>Valor (uni)</strong></TableCell>
              <TableCell><strong>Qtd</strong></TableCell>
              <TableCell><strong>Editar</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nome}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>R$ {product.valor}</TableCell>
                <TableCell>{product.quantidade}x</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/editar-produto/${product.id}`)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Botão de Cadastro de Produto */}
      <Box sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        padding: 2,
      }}>
        <IconButton onClick={() => navigate("/cadastro-produto-route")} color="primary">
          <AddCircleIcon sx={{ fontSize: "5rem", bgcolor: "white", borderRadius: "50%", }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Estoque;
