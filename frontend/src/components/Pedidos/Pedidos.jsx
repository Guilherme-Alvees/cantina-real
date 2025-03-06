import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import { Person, Remove, Add } from "@mui/icons-material";

const products = [
  {
    id: 1,
    name: "Coca Cola",
    price: 5.0,
    image: "🔴",
    description: "Latinha - 350 ml",
  },
  {
    id: 2,
    name: "Guaraná",
    price: 5.0,
    image: "🟢",
    description: "Latinha - 350 ml",
  },
  {
    id: 3,
    name: "Água",
    price: 5.0,
    image: "🔵",
    description: "Garrafa - 350 ml",
  },
];

const Pedidos = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [quantities, setQuantities] = useState({});

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  return (
    <div>
      {/* App Bar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <IconButton>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Voltar
              </Link>
            </IconButton>
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
            User Name
          </Typography>
          <Avatar>
            <Person />
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Bebidas" />
        <Tab label="Comidas" disabled />
      </Tabs>

      {/* Product List */}
      <Grid container spacing={2} style={{ padding: 16 }}>
        {products.map((product) => (
          <Grid item xs={12} key={product.id}>
            <Card>
              <CardContent
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5">{product.image}</Typography>
                <div style={{ flexGrow: 1, marginLeft: 16 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                </div>
                <Typography variant="h6">
                  R$ {product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions style={{ justifyContent: "flex-end" }}>
                <IconButton onClick={() => updateQuantity(product.id, -1)}>
                  <Remove />
                </IconButton>
                <Typography>{quantities[product.id] || 0}</Typography>
                <IconButton onClick={() => updateQuantity(product.id, 1)}>
                  <Add />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirm Button */}
      <Button
        variant="contained"
        color="success"
        fullWidth
        style={{ margin: 16, padding: 12 }}
      >
        CONFIRMAR ITENS
      </Button>
    </div>
  );
};

export default Pedidos;
