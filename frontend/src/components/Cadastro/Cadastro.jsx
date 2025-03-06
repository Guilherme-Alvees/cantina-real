import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Cadastro() {
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Foto padrão para quando o usuário não carregar uma imagem
  const defaultImage = "/default-img-user.png";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 3,
        overflow: "hidden",
      }}
    >
      {/* Botão de voltar */}
      <Box sx={{ alignSelf: "flex-start" }}>
        <IconButton>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Avatar que abre a galeria ao clicar */}
      <label htmlFor="imageUpload">
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <Avatar
          sx={{
            width: 150,
            height: 150,
            cursor: "pointer",
            marginBottom: 2,
            backgroundColor: "#ffff",
          }}
        >
          <img
            src={profileImage || defaultImage} // Se não houver imagem, usa a imagem padrão
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </Avatar>
      </label>

      {/* Campos de entrada */}
      <TextField label="Nome *" variant="filled" fullWidth sx={inputStyle} />
      <TextField label="Email *" variant="filled" fullWidth sx={inputStyle} />
      <TextField
        label="Telefone *"
        variant="filled"
        fullWidth
        sx={inputStyle}
      />

      {/* Campo de senha */}
      <FormControl fullWidth variant="filled" sx={inputStyle}>
        <InputLabel htmlFor="filled-adornment-password">Senha *</InputLabel>
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

      {/* Botão Cadastrar */}
      <Button
        onClick={handleClick}
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#00bf63",
          mt: 2,
          borderRadius: 3,
          fontWeight: "bold",
          padding: "0.5rem",
          marginTop: "3rem",
        }}
        endIcon={<ArrowForwardIcon />}
      >
        CADASTRAR
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
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
