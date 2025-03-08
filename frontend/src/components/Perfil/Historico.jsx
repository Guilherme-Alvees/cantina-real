import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";

const Historico = ({ dataPedido, pedidos }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 1,
        overflowX: "auto", 
        whiteSpace: "nowrap", 
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          p: 1,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CalendarMonthSharpIcon sx={{ mr: 1 }} />
        {dataPedido}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Produto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Qtd</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
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

export default Historico;
