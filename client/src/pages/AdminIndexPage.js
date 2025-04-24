import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/AuthStore';

function AdminIndexPage() {
  const navigate = useNavigate();
  const isAdmin = authStore.token && authStore.getUserData()?.role === 'ADMIN';

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: { xs: 2, md: 6 }, px: { xs: 1, md: 2 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Админ-панель
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{width: "100%"}}>
            <CardActionArea onClick={() => navigate('/company-management')}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Управление компаниями
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Просмотр, добавление и редактирование компаний
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{width: "100%"}}>
            <CardActionArea onClick={() => navigate('/car-management')}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Управление автомобилями
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Просмотр, добавление и редактирование автомобилей
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{width: "100%"}}>
            <CardActionArea onClick={() => navigate('/user-management')}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Управление пользователями
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Просмотр, бан и разблокировка пользователей
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{width: "100%"}}>
            <CardActionArea onClick={() => navigate('/drivers-management')}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Управление водителями
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Просмотр, добавление и редактирование водителей
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{width: "100%"}}>
            <CardActionArea onClick={() => navigate('/company-ratings')}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Рейтинги компаний
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Просмотр рейтингов и создание отчёта
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminIndexPage;
