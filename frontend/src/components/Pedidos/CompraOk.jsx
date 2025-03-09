import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Navbar from "../Navbar/Navbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const CompraOk = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}> 
      <Navbar />
      <Box sx={{ mt: 9}}>
        <IconButton onClick={() => navigate("/pedidos-route")} color="inherit">
          <ArrowBackIcon /><Typography sx={{textAlign: "left",}}>Voltar</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default CompraOk;
