import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { getFoodAndDrinks } from '../../axios';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LiquorIcon from '@mui/icons-material/Liquor';
import LunchDiningIcon from '@mui/icons-material/LunchDining';

export default function Pedidos() {
  const [value, setValue] = useState(0);
  const [products, setProducts] = useState({ comidas: [], bebidas: [] });
  const [selectedItems, setSelectedItems] = useState({});
  
  useEffect(() => {
    getFoodAndDrinks().then((response) => {
      setProducts(response.data);
    }).catch((error) => {
      console.error('Erro ao buscar produtos:', error);
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleQuantityChange = (name, change, stock) => {
    setSelectedItems((prev) => {
      const newCount = (prev[name] || 0) + change;
      if (newCount < 0 || newCount > stock) return prev;
      return { ...prev, [name]: newCount };
    });
  };

  const calculateTotal = () => {
    return Object.keys(selectedItems).reduce((total, name) => {
      const product = [...products.comidas, ...products.bebidas].find(p => p.nome === name);
      return total + (product ? parseFloat(product.valor) * selectedItems[name] : 0);
    }, 0).toFixed(2);
  };

  const renderTable = (items) => (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow sx={{ '& th': { padding: '6px' } }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quantidade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.nome} sx={{ '& td': { padding: '8px' } }}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>R$ {item.valor}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleQuantityChange(item.nome, -1, item.quantidade)} disabled={!selectedItems[item.nome]}>
                  <RemoveCircleIcon color={selectedItems[item.nome] ? "primary" : "disabled"} />
                </IconButton>
                {selectedItems[item.nome] || 0}
                <IconButton onClick={() => handleQuantityChange(item.nome, 1, item.quantidade)} disabled={item.quantidade === 0}>
                  <AddCircleIcon color={item.quantidade === 0 ? "disabled" : "primary"} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Navbar />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 7 }}>
        <Tabs value={value} onChange={handleChange} aria-label="abas de pedidos">
          <Tab icon={<LiquorIcon />} label="Bebidas" />
          <Tab icon={<LunchDiningIcon />} label="Comidas" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>
        {value === 0 ? renderTable(products.bebidas) : renderTable(products.comidas)}
      </Box>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green' }}>Total: R$ {calculateTotal()}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} disabled={calculateTotal() === '0.00'}>
          CONFIRMAR COMPRA
        </Button>
      </Box>
    </Box>
  );
}
