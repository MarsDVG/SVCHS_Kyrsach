import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Snackbar, Button } from '@mui/material';
import authStore from '../stores/AuthStore';
import { fetchUserOrders } from '../api/listApi';

const ProfilePage = observer(() => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userData = authStore.getUserData();
  const userId = userData && (userData.id || userData.userId || userData.email || userData._id);

  useEffect(() => {
    if (!userId) {
      setError('Пользователь не найден');
      setLoading(false);
      return;
    }
    fetchUserOrders(userId)
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки заказов');
        setLoading(false);
      });
  }, [userId]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
          Профиль
        </Typography>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1" color="text.secondary">
            {userData?.email ? `Почта: ${userData.email}` : 'Нет данных о пользователе'}
          </Typography>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Ваши заказы
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Заказов не найдено
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ minWidth: 340 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Номер заказа</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, idx) => (
                  <TableRow key={order.id || idx}>
                    <TableCell>{order.id || idx}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
});

export default ProfilePage;
