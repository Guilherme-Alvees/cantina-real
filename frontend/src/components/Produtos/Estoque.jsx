import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Navbar from "../Navbar/Navbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Estoque = () => {

  const navigate = useNavigate();

  const goToPerfil = () => {
    navigate("/perfil-route");
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}> 
      <Navbar />
      <Box sx={{ mt: 9}}>
        <IconButton onClick={goToPerfil} color="inherit">
          <ArrowBackIcon /><Typography
        sx={{
          textAlign: "left",
        }}
      >
        Voltar
      </Typography>
        </IconButton>
      </Box>

       {/* Botão de Cadastro de Produto fixado no final da tela, maior, azul e à direita */}
       <Box sx={{
        position: 'fixed',
        bottom: 16,
        right: 6,
        borderRadius: '50%',
        padding: 2,
      }}>
        <IconButton 
          onClick={() => navigate("/cadastro-produto-route")} color="primary"
        >
          <AddCircleIcon sx={{
            fontSize: '5rem',
            position: 'rigth'
          }}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Estoque;
