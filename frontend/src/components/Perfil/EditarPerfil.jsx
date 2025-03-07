import React, { useState, useEffect } from "react";
import { updateUser } from "../../axios"; 
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function EditarPerfil() {
  const navigate = useNavigate();
  
  // Carrega os dados do usuário logado do localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    id: storedUser.id || "",
    nome: storedUser.nome || "",
    email: storedUser.email || "",
    telefone: storedUser.telefone || "",
    senha: "", // Não trazemos a senha por segurança
  });

  const [showPassword, setShowPassword] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Atualiza os campos do formulário conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Alterna a visibilidade da senha
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Envia os dados para o backend ao clicar no botão "Atualizar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenLoad(true);
    setErrorMessage("");

    try {
      await updateUser(formData.id, formData);
      setOpenSnackBar(true);

      // Atualiza os dados no localStorage
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...formData }));

      setTimeout(() => {
        navigate("/perfil-route");
      }, 2000);
    } catch (error) {
      setErrorMessage("Erro ao editar. Verifique os dados e tente novamente.");
      setOpenLoad(false);
    }
  };

  // Fecha o Snackbar de sucesso
  const handleClose = () => {
    setOpenSnackBar(false);
    setOpenLoad(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 3,
        position: "fixed",
      }}
    >
      {/* Botão de voltar */}
      <Box sx={{ alignSelf: "flex-start", mt: -5, mb: 8 }}>
        <IconButton>
          <Link to="/perfil-route" style={{ color: "inherit", textDecoration: "none" }}>
            <ArrowBackIcon fontSize="large" />
          </Link>
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Nome"
          name="nome"
          variant="filled"
          fullWidth
          sx={inputStyle}
          onChange={handleChange}
          value={formData.nome}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="filled"
          fullWidth
          sx={inputStyle}
          onChange={handleChange}
          value={formData.email}
          required
        />
        <TextField
          label="Telefone"
          name="telefone"
          variant="filled"
          fullWidth
          sx={inputStyle}
          onChange={handleChange}
          value={formData.telefone}
          required
        />

        {/* Campo de senha */}
        <FormControl fullWidth variant="filled" sx={inputStyle}>
          <InputLabel htmlFor="filled-adornment-password">Nova Senha</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            name="senha"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            value={formData.senha}
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

        {/* Botão Atualizar */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#00bf63",
            mt: 8,
            borderRadius: 3,
            fontWeight: "bold",
            padding: "0.5rem",
          }}
          endIcon={<ArrowForwardIcon />}
        >
          ATUALIZAR
        </Button>
      </form>

      {/* Mensagem de erro */}
      {errorMessage && (
        <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={openLoad}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={openSnackBar} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Usuário atualizado com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Estilo para os campos de entrada
const inputStyle = {
  borderRadius: 1,
  mt: 2,
};

export default EditarPerfil;
