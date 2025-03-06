import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
      }}
    >
      {/* Logo */}
      <img src="/logo-cantina-real.png" alt="Logo Cantina Real" width={200} />

      {/* Campos de entrada */}
      <TextField
        label="Email"
        variant="filled"
        fullWidth
        sx={{
          borderRadius: 1,
          mt: 2,
        }}
      />
      <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
        <InputLabel htmlFor="filled-adornment-password">Senha</InputLabel>
        <FilledInput
          id="filled-adornment-password"
          type={showPassword ? "text" : "password"}
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

      {/* Botão CADASTRAR */}
      <Button
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
