import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, admStatus } from "../../axios";
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
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Navbar from "../Navbar/Navbar";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const sortedUsers = response.data.sort((a, b) => b.adm_user - a.adm_user); // Admins primeiro
      setUsers(sortedUsers);
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

    setModifiedUsers((prevModifiedUsers) => ({
      ...prevModifiedUsers,
      [id]: !users.find((user) => user.id === id).adm_user, // Inverte o status do usuário no estado de alterações
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(modifiedUsers).map(([id, adm_user]) =>
        admStatus(id, adm_user).then((response) => ({
          id,
          user: response.data.user,
        }))
      );

      // Aguarda todas as atualizações do status serem salvas
      const updatedUsers = await Promise.all(updates);

      // Atualiza a lista de usuários após salvar as alterações
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const updatedUser = updatedUsers.find((u) => u.id === user.id);
          return updatedUser
            ? { ...user, adm_user: updatedUser.user.adm_user }
            : user;
        })
      );

      // Limpa as alterações
      setModifiedUsers({});
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    } finally {
      setLoading(false);
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
                      onChange={() => handleToggleAdmin(user.id)} // Altera o status de admin
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
        disabled={Object.keys(modifiedUsers).length === 0 || loading}
        onClick={handleSaveChanges}
        sx={{
          position: "fixed",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Salvar Alterações"
        )}
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
            sx={{ fontSize: "4rem", bgcolor: "white", borderRadius: "50%" }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Users;
