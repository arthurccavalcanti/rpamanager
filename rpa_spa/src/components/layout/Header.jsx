import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
          Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SvgIcon from '@mui/material/SvgIcon';
import BRFlag from '../../assets/BrazilianFlag.svg?react';
import SpanishFlag from '../../assets/SpanishFlag.svg?react';

import { useLang } from '../../contexts/LangWrapper';
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function Header() {

  const { setLanguage } = useLang();
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
  const handleMenuClose = () => { setAnchorEl(null); };

  const handleLogout = () => {
    handleMenuClose()
    logout();
    navigate('/api/auth/login');
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    setDrawerOpen(false);
    navigate(path);
  };

  const handleLanguageChange = (language) => {
    setLanguage(language);
  };

  // Hamburger
  const drawer = (
    <Box
      sx={{ width: 250 }}
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate('/api/user')}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary={<FormattedMessage id="header.userPage" defaultMessage="Página do Usuário" />} />
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('/api/admin')}>
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary={<FormattedMessage id="header.adminPage" defaultMessage="Página do Admin" />} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary.main" enableColorOnDark>
        <Toolbar>

          {isAuthenticated && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {<FormattedMessage id="header.title" defaultMessage="Sistema de RPAs" />}
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {isAuthenticated ?
            (
              <>
                {isAdmin &&
                <Button color="inherit" onClick={() => handleNavigate('/api/admin')}>
                  <FormattedMessage id="header.admin" defaultMessage="Administrador" />
                </Button>
                }
                <Button color="inherit" onClick={() => handleNavigate('/api/user')}>
                  <FormattedMessage id="header.user" defaultMessage="Usuário" />
                </Button>
              </>
            ) :
            (
              <>
                <Button color="inherit" onClick={() => handleNavigate('/api/auth/login')}>
                  <FormattedMessage id="header.login" defaultMessage="Login" />
                </Button>
                <Button color="inherit" onClick={() => handleNavigate('/api/auth/register')}>
                  {<FormattedMessage id="header.register" defaultMessage="Cadastro" />}
                </Button>
              </>
            )}
            <IconButton onClick={() => handleLanguageChange('pt-BR')}>
              <SvgIcon component={BRFlag} sx={{fontSize:'2rem' }} inheritViewBox />
            </IconButton>
            <IconButton onClick={() => handleLanguageChange('es-ES')}>
              <SvgIcon component={SpanishFlag} sx={{fontSize:'2rem' }} inheritViewBox />
            </IconButton>
          </Box>

          {/* User */}
          {isAuthenticated && (
            <div>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {user.username.split('@')[0]}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => handleNavigate('/api/user')}>
                  <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                  <FormattedMessage id="header.myPage" defaultMessage="Minha Página" />
                </MenuItem>

                <MenuItem onClick={() => handleNavigate('/api/changePassword')}>
                  <ListItemIcon><VpnKeyIcon fontSize="small" /></ListItemIcon>
                  <FormattedMessage id="header.resetPassword" defaultMessage="Redefinir senha" />
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  <FormattedMessage id="header.logout" defaultMessage="Logout" />
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
}