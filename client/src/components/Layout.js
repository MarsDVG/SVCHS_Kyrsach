import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery, ButtonBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';
import { useNavigate } from 'react-router-dom';

const Layout = observer(({ children }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:500px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (path) => {
    setDrawerOpen(false);
    if (path === 'logout') {
      authStore.logout();
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const isAdmin = authStore.token && authStore.getUserData()?.role === 'ADMIN'

  const menuItems = [
    { label: 'Главная', path: '/' },
    { label: 'FAQ', path: '/faq' },
    isAdmin && { label: 'Админ', path: '/admin' },
    authStore.token
      ? { label: 'Выйти', path: 'logout' }
      : { label: 'Войти', path: '/login' }
  ].filter(Boolean)

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff'
    }}>
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <ButtonBase onClick={() => navigate('/')} sx={{ borderRadius: 1, px: 1 }}>
              <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 700 }}>
                Сервис грузоперевозок
              </Typography>
            </ButtonBase>
          </Box>
          {isMobile ? (
            <>
              <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 220 } }}
              >
                <List>
                  {menuItems.map((item, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemButton onClick={() => handleMenuClick(item.path)}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <>
              {menuItems.map((item, idx) => (
                <Button key={idx} color="inherit" onClick={() => handleMenuClick(item.path)}>{item.label}</Button>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ width: '100%', flex: 1 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 4, textAlign: 'center', backgroundColor: '#1976d2', color: '#fff', width: '100%' }}>
        <Typography> 2025 Сервис грузоперевозок</Typography>
      </Box>
    </Box>
  );
});

export default Layout;
