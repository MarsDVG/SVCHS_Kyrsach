import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Button, Fade, useTheme } from '@mui/material';

function AnimatedTruck() {
  const theme = useTheme();
  return (
    <Box sx={{
      position: 'absolute',
      left: { xs: '-80px', sm: '-120px' },
      bottom: 0,
      width: { xs: 120, sm: 180 },
      height: 80,
      zIndex: 1,
      pointerEvents: 'none',
      animation: 'truck-move 5s linear infinite',
      '@keyframes truck-move': {
        '0%': { left: '-80px' },
        '100%': { left: 'calc(100% + 80px)' }
      }
    }}>
      <svg viewBox="0 0 180 80" width="100%" height="100%">
        <rect x="20" y="30" width="80" height="30" rx="8" fill={theme.palette.primary.main} />
        <rect x="100" y="40" width="40" height="20" rx="5" fill={theme.palette.secondary.main} />
        <circle cx="40" cy="65" r="12" fill="#222" />
        <circle cx="120" cy="65" r="12" fill="#222" />
        <circle cx="40" cy="65" r="7" fill="#fff" />
        <circle cx="120" cy="65" r="7" fill="#fff" />
      </svg>
    </Box>
  );
}

function MainPage() {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%)',
          minHeight: { xs: 340, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Fade in timeout={1200}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              mb: 2,
              color: theme.palette.primary.dark,
              fontSize: { xs: '2rem', md: '3rem' },
              zIndex: 2
            }}
          >
            Онлайн-платформа грузоперевозок
          </Typography>
        </Fade>
        <Fade in timeout={1800}>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontWeight: 500,
              zIndex: 2,
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            Найдите компанию, машину и водителя для вашего груза
          </Typography>
        </Fade>
        <Fade in timeout={2400}>
          <Button
            variant="contained"
            size="large"
            
            onClick={() => window.location.href = '/companies'}
            sx={{ px: 5, py: 1.5, fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 700, zIndex: 2, boxShadow: 4 }}
          >
            Начать
          </Button>
        </Fade>
        <AnimatedTruck />
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => window.location.href = '/companies'}>
              <CardContent>
                <Typography variant="h5">Заказ услуг</Typography>
                <Typography>Закажите перевозку и дополнительные услуги.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => window.location.href = '/user-orders'}>
              <CardContent>
                <Typography variant="h5">Активные заказы и избранные компании</Typography>
                <Typography>Просмотр ваших активных заказов и избранных компаний.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => window.location.href = '/company-ratings'}>
              <CardContent>
                <Typography variant="h5">Рейтинги и отзывы</Typography>
                <Typography>Оставляйте оценки компаниям.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => window.location.href = '/profile'}>
              <CardContent>
                <Typography variant="h5">Профиль</Typography>
                <Typography>Ваш профиль.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }} onClick={() => window.location.href = '/promotions'}>
              <CardContent>
                <Typography variant="h5">Акции и скидки</Typography>
                <Typography>Актуальные предложения и специальные условия для клиентов.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default MainPage;
