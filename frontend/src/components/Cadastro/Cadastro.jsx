import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../axios";

import {
  Box,
  Typography,
  Snackbar,
  IconButton,
  Alert,
  Backdrop,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const Cadastro = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await registerUser(userData);
      setSuccessMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Erro ao cadastrar usuário.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ mt: 9, alignItems: "center" }}>
        <IconButton onClick={() => navigate("/")} color="inherit">
          <ArrowBackIcon />
          <Typography sx={{ textAlign: "left" }}>Voltar</Typography>
        </IconButton>
      </Box>
      <Typography sx={{ fontWeight: "bold", textAlign: "center", color: "green" }}>
        Cadastro de Usuário
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <TextField fullWidth label="Nome" name="nome" value={userData.nome} onChange={handleChange} required />
        <TextField fullWidth label="Email" name="email" type="email" value={userData.email} onChange={handleChange} required />
        <TextField fullWidth label="Telefone" name="telefone" value={userData.telefone} onChange={handleChange} required />
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            name="senha"
            type={showPassword ? "text" : "password"}
            value={userData.senha}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha"
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, fontWeight: "bold" }}>
          Cadastrar
        </Button>
      </Box>

      {errorMessage && <Alert severity="error" sx={{ width: "100%", mt: 2 }}>{errorMessage}</Alert>}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!successMessage} onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cadastro;
