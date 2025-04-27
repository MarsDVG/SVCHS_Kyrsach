import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Divider, Tabs, Tab, Avatar, Stack, Grid, Button } from '@mui/material';
import { fetchUserOrders, removeFromList } from '../api/listApi';
import { fetchUserFavorites, removeFavoriteCompany } from '../api/favoritesApi';
import { fetchAllCompanyInfo } from '../api/company_infoApi';
import authStore from '../stores/AuthStore';
import CheckIcon from '@mui/icons-material/Check';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const userData = authStore.getUserData();
    const userId = userData && (userData.id || userData.userId || userData.email || userData._id);
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetchUserOrders(userId),
      fetchUserFavorites(userId),
      fetchAllCompanyInfo()
    ])
      .then(([ordersData, favoritesData, companiesData]) => {
        setOrders(ordersData || []);
        setFavorites(favoritesData || []);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteOrder = (listId, companyId) => {
    removeFromList(listId, companyId)
      .then(() => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== companyId));
        window.location.reload(); 
      })
      .catch((error) => {
        console.error('Ошибка удаления заказа:', error);
      });
  };

  const handleDeleteFavorite = (companyId) => {
    const userData = authStore.getUserData();
    const userId = userData && (userData.id || userData.userId || userData.email || userData._id);
    if (!userId) return;
    removeFavoriteCompany(userId, companyId)
      .then(() => {
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.companyId !== companyId));
      })
      .catch((error) => {
        console.error('Ошибка удаления избранной компании:', error);
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={3} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 3, background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center" color="primary.dark">
          Личный список заказов
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Мои заказы" />
          <Tab label="Избранные компании" />
        </Tabs>
        {tab === 0 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                У вас пока нет заказов
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 0, mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Грузчики</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow key={order.id} hover>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</TableCell>
                        <TableCell>{order.workers ? <CheckIcon /> : '—'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDeleteOrder(order.id, order.companyId)}
                          >
                            Отменить заказ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
            {favorites.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                Нет избранных компаний
              </Typography>
            ) : (
              <Grid container spacing={2} sx={{ mt: 2, height: '100%' }}>
                {favorites.map((fav) => {
                  const company = companies.find((c) => c.id === fav.companyId);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={fav.id} sx={{ height: '100%' }}>
                      <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', background: 'linear-gradient(120deg, #fdf6e3 0%, #e0e7ff 100%)' }}>
                        <Typography variant="h6">{company?.name || 'Компания'}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, whiteSpace: 'pre-wrap' }}>{company?.description || ''}</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDeleteFavorite(fav.companyId)}
                        >
                          Удалить из избранного
                        </Button>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default UserOrdersPage;