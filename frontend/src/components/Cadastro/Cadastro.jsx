import React, { useState } from "react";
import { registerUser } from "../../axios"; // Importe a função de requisição
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

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
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

  // Envia os dados para o backend ao clicar no botão "Cadastrar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenLoad(true);
    setErrorMessage("");

    try {
      await registerUser(formData);
      setOpenSnackBar(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setErrorMessage("Erro ao cadastrar. Verifique os dados e tente novamente.");
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
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
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
          required
        />
        <TextField
          label="Telefone"
          name="telefone"
          variant="filled"
          fullWidth
          sx={inputStyle}
          onChange={handleChange}
          required
        />

        {/* Campo de senha */}
        <FormControl fullWidth variant="filled" sx={inputStyle}>
          <InputLabel htmlFor="filled-adornment-password">Senha *</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            name="senha"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            required
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

        {/* Botão Cadastrar */}
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
          CADASTRAR
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
          Usuário cadastrado com sucesso!
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

export default Cadastro;
