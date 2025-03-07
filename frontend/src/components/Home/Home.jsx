import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../axios";

import {
  Box,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Home() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const closeBackdrop = () => {
    setOpenBackdrop(false);
  };

  const handleClick = () => {
    navigate("/cadastro-route");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Reseta mensagens de erro antes do login
    setOpenBackdrop(true);
  
    if (!email || !senha) {
      setOpenBackdrop(false);
      setErrorMessage("Por favor, preencha todos os campos!");
      return;
    }
  
    try {
      const response = await loginUser({ email, senha }); // Chama a API de login
      console.log("Login bem-sucedido:", response.data);
  
      // Armazena os dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
  
      // Redireciona para a página de pedidos
      navigate("/pedidos-route"); 
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setOpenBackdrop(false); // Fecha o carregamento
  
      // Exibir mensagem de erro amigável
      if (error.response) {
        setErrorMessage(error.response.data.error || "Erro ao fazer login!");
      } else {
        setErrorMessage("Erro de conexão com o servidor!");
      }
    }
  };  

  return (
    <Box
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "fixed",
        padding: 3
      }}
    >
      {/* Logo */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <img src="/logo-cantina-real.png" alt="Logo Cantina Real" width={200} />
      </Box>

      {/* Exibir erro, se houver */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {errorMessage}
        </Alert>
      )}

      {/* Campo de Email */}
      <TextField
        label="Email"
        variant="filled"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ borderRadius: 1, mt: 2 }}
      />

      {/* Campo de Senha */}
      <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
        <InputLabel htmlFor="filled-adornment-password">Senha</InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type={showPassword ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      {/* Botão Entrar */}
      <Button
        onClick={handleLogin}
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#00bf63",
          mt: 2,
          borderRadius: 3,
          marginTop: "5rem",
          fontWeight: "bold",
          padding: "0.5rem",
        }}
      >
        ENTRAR
      </Button>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
        onClick={closeBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Botão CADASTRAR */}
      <Button
        onClick={handleClick}
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#7ed957",
          mt: 2,
          borderRadius: 3,
          fontWeight: "bold",
          padding: "0.5rem",
        }}
      >
        CADASTRAR
      </Button>
    </Box>
  );
}

export default Home;
