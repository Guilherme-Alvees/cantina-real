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
  OutlinedInput,
  InputAdornment,
  Alert,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!email || !senha) {
      setErrorMessage("Por favor, preencha todos os campos!");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, senha });
      console.log("Login bem-sucedido:", response.data);

      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccessMessage("Login realizado com sucesso!");
        setTimeout(() => {
          navigate("/pedidos-route");
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      if (error.response) {
        setErrorMessage(error.response.data.error || "Erro ao fazer login!");
      } else {
        setErrorMessage("Erro de conexão com o servidor!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <img src="/logo-cantina-real.png" alt="Logo Cantina Real" width={200} />
      </Box>

      {/* Título */}
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", color: "green", mb: 2 }}
      >
        Login de Usuário
      </Typography>

      {/* Formulário */}
      <Box
        component="form"
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Campo de Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo de Senha */}
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
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
            label="Senha"
          />
        </FormControl>

        {/* Botão de Entrar */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 2, fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Entrar"}
        </Button>

        {/* Botão de Cadastrar */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/cadastro-route")}
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          Cadastrar
        </Button>

        {/* Botão de Esqueci a Senha (Opcional) */}
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate("/recuperar-senha-route")} // Adicione a rota correta
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          Esqueci a senha
        </Button>
      </Box>

      {/* Mensagens de Erro e Sucesso */}
      {errorMessage && (
        <Alert severity="error" sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert
            onClose={() => setSuccessMessage("")}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Backdrop de Carregamento */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Login;
