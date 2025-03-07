import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const hello = "Olá, ";
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const profileClick = () => {
    navigate("/perfil-route");
  };

  const logoutClick = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      style={{
        width: "100vw",
        left: 0,
        top: 0,
      }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <SettingsIcon style={{color:"#ffff"}}/>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
              <MenuItem onClick={profileClick} >
                    <PersonIcon/><Typography style={{marginLeft: "10px"}}> Perfil</Typography>
              </MenuItem>
              <MenuItem onClick={logoutClick}>
                    <LogoutIcon/><Typography style={{marginLeft: "10px"}}> Sair</Typography>
              </MenuItem>
          </Menu>
        </Box>
        <Typography variant="h6">{hello} Username</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
