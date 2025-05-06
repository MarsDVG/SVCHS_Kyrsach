import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { fetchPromotions } from '../api/promotionApi'; 

function PromotionsPage() {
  const theme = useTheme();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPromotions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPromotions();
        if (response && Array.isArray(response)) {
          const activePromotions = response.filter(promotion => promotion.isActive);
          setPromotions(activePromotions);
        } else {
          setError('Неверный формат данных, полученных от API.');
        }
      } catch (err) {
        setError(err.message || 'Ошибка при загрузке акций.');
      } finally {
        setLoading(false);
      }
    };

    getPromotions();
  }, []);

  const getColorByType = (type) => {
    switch (type) {
      case 'Скидка':
        return 'success';
      case 'Промокод':
        return 'primary';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 6 },
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant="h6">Загрузка акций...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 6 },
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.error.main,
      }}>
        <Typography variant="h6">Ошибка: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Список Акций
      </Typography>
      <List>
        {promotions.map((promotion) => (
          <ListItem key={promotion.id}>
            <ListItemText
              primary={promotion.title}
              secondary={
                <>
                  {promotion.description} - Действует до: {dayjs(promotion.validUntil).format('DD.MM.YYYY')}
                  <br />
                  Тип: {promotion.type}
                  {promotion.type === 'Скидка' && (
                    <>
                      <br />
                      Скидка: {promotion.discountPercentage}%
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default PromotionsPage;