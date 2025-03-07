import React from "react";
import { 
Table, 
TableBody, 
TableCell, 
TableContainer, 
TableHead, 
TableRow, 
Paper, 
Typography } from "@mui/material";

const PedidoTable = ({ dataPedido, pedidos }) => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 500, margin: "auto", mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
        {dataPedido}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produto</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Qtd</TableCell>
            <TableCell>Valor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map((pedido, index) => (
            <TableRow key={index}>
              <TableCell>{pedido.nome}</TableCell>
              <TableCell>{pedido.descricao}</TableCell>
              <TableCell>{pedido.quantidade}x</TableCell>
              <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PedidoTable;
