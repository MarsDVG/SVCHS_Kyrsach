import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Stack, useTheme } from '@mui/material';

const mockPromotions = [
  {
    title: 'Весенняя распродажа',
    description: 'Скидка 20% на все услуги перевозки до конца апреля!',
    type: 'Скидка',
    validUntil: '30.04.2025',
    color: 'success',
  },
  {
    title: 'Подарок новым клиентам',
    description: 'Бесплатные услуги грузчиков чдля первого заказа.',
    type: 'Подарок',
    validUntil: '31.05.2025',
    color: 'info',
  },
  {
    title: 'Счастливые выходные',
    description: '10% скидка на перевозки в выходные дни.',
    type: 'Скидка',
    validUntil: '01.06.2025',
    color: 'warning',
  },
  {
    title: 'Промокод "ЛЕТО2025"',
    description: 'Используйте промокод и получите скидку 15% на следующую перевозку.',
    type: 'Промокод',
    validUntil: '15.06.2025',
    color: 'primary',
  },
];

function PromotionsPage() {
  const theme = useTheme();
  return (
    <Box sx={{
      py: { xs: 4, md: 6 },
      px: { xs: 2, md: 6 },
      minHeight: '60vh',
      background: 'linear-gradient(120deg, #f0fdfa 0%, #e0e7ff 100%)',
    }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: theme.palette.primary.dark, textAlign: 'center' }}>
        Акции и скидки
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {mockPromotions.map((promo, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {promo.title}
                  </Typography>
                  <Chip label={promo.type} color={promo.color} size="small" />
                </Stack>
                <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                  {promo.description}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
                  Действует до: {promo.validUntil}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PromotionsPage;
