import React, { useState } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box, InputBase, Paper, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

function FAQPage() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const faqs = [
    { question: 'Как зарегистрироваться?', answer: 'Нажмите на кнопку Войти и затем на ссылку Регистрация, заполните форму и подтвердите email.' },
    { question: 'Как добавить компанию в избранное?', answer: 'На странице компании нажмите на иконку сердца, чтобы добавить её в избранное.' },
    { question: 'Как оформить заказ?', answer: 'Выберите компанию и машину, нажмите кнопку Заказать и заполните информацию о грузе.' },
    { question: 'Как оставить отзыв?', answer: 'На странице компании выберите рейтинг от 1 до 5 и нажмите Отправить.' },
  ];
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 5 } }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
        Часто задаваемые вопросы
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Ответы на популярные вопросы по использованию сервиса
      </Typography>
      <Paper
        component="form"
        sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', mb: 4, maxWidth: 400, mx: 'auto', boxShadow: 0, border: `1px solid ${theme.palette.divider}` }}
        onSubmit={e => e.preventDefault()}
        elevation={0}
      >
        <SearchIcon color="action" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Поиск по вопросам..."
          inputProps={{ 'aria-label': 'поиск по вопросам' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Paper>
      <Box sx={{ mt: 1 }}>
        {filteredFaqs.length === 0 ? (
          <Typography align="center" color="text.secondary">Ничего не найдено</Typography>
        ) : (
          filteredFaqs.map((item, idx) => (
            <Accordion
              key={idx}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                background: theme.palette.mode === 'light' ? '#f8fafc' : theme.palette.background.paper,
                '&:before': { display: 'none' },
                overflow: 'hidden'
              }}
              disableGutters
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 2 }}>
                <Typography variant="body1">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Container>
  );
}

export default FAQPage;
