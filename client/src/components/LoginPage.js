import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../stores/AuthStore';
import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await authStore.login();
    if (authStore.token) navigate('/');
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>Вход</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={authStore.email}
            onChange={e => authStore.setEmail(e.target.value)}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={authStore.password}
            onChange={e => authStore.setPassword(e.target.value)}
          />
          {authStore.error && <Typography color="error">{authStore.error}</Typography>}
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={authStore.isLoading}
            >
              {authStore.isLoading ? 'Загрузка...' : 'Войти'}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <Link href="/register" onClick={e => { e.preventDefault(); navigate('/register'); }}>
              Нет аккаунта? Зарегистрироваться
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
});

export default LoginPage;
