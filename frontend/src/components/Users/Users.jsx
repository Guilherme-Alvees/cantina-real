import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { getAllUsers } from "../../axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Navbar from "../Navbar/Navbar";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({}); // Estado para mudanças pendentes

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleToggleAdmin = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, adm_user: !user.adm_user } : user
      )
    );

    setModifiedUsers((prev) => ({
      ...prev,
      [id]:
        !prev[id] !== undefined
          ? !prev[id]
          : !users.find((u) => u.id === id).adm_user,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updates = Object.entries(modifiedUsers).map(([id, adm_user]) =>
        axiosInstance.put(`/users/${id}/admin`, { adm_user })
      );

      await Promise.all(updates);
      setModifiedUsers({});
      fetchUsers();
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Navbar />
      <Box sx={{ mt: 9 }}>
        <IconButton onClick={() => navigate("/perfil-route")} color="inherit">
          <ArrowBackIcon />
          <Typography sx={{ textAlign: "left" }}>Voltar</Typography>
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Usuários cadastrados: {users.length}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="center">Administrador</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={user.adm_user}
                      onChange={() => handleToggleAdmin(user.id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Button
        variant="contained"
        color="success"
        disabled={Object.keys(modifiedUsers).length === 0}
        onClick={handleSaveChanges}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Salvar Alterações
      </Button>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          padding: 2,
        }}
      >
        <IconButton onClick={() => navigate("/cadastro-route")} color="primary">
          <AddCircleIcon
            sx={{ fontSize: "5rem", bgcolor: "white", borderRadius: "50%" }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Users;
