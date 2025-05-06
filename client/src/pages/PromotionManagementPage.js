import React, { useState, useEffect } from 'react';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../api/promotionApi';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function PromotionManagementPage() {
  const [promotions, setPromotions] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    type: 'Скидка',
    validUntil: dayjs(),
    discountPercentage: 0,
    isActive: true,
  });

  const [createErrors, setCreateErrors] = useState({
    title: false,
    description: false,
    discountPercentage: false,
  });

  const [editErrors, setEditErrors] = useState({
    title: false,
    description: false,
    discountPercentage: false,
  });

  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await fetchPromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Ошибка при загрузке акций:', error);
    }
  };

  const handleCreatePromotion = async () => {
    let hasErrors = false;
    const newErrors = {
      title: !newPromotion.title,
      description: !newPromotion.description,
      discountPercentage: !newPromotion.discountPercentage,
    };

    setCreateErrors(newErrors);
    hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      return;
    }
    try {
      const promotionData = {
        ...newPromotion,
        validUntil: newPromotion.validUntil.toISOString(), 
      };
      await createPromotion(promotionData);
      loadPromotions();
      handleCloseCreate();
      setErrorMessage(''); 
    } catch (error) {
      console.error('Ошибка при создании акции:', error);
      setErrorMessage(error.response?.data?.message || 'Ошибка при создании акции: Нельзя создать два одинаковых промокода'); 
    }
  };

  const handleUpdatePromotion = async () => {
    let hasErrors = false;
    const newErrors = {
      title: !selectedPromotion.title,
      description: !selectedPromotion.description,
      discountPercentage: !selectedPromotion.discountPercentage,
    };

    setEditErrors(newErrors);
    hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) {
      return;
    }
    try {
      const promotionData = {
        ...selectedPromotion,
        validUntil: dayjs(selectedPromotion.validUntil).toISOString(),
      };
      await updatePromotion(selectedPromotion.id, promotionData);
      loadPromotions();
      handleCloseEdit();
      setErrorMessage(''); 
    } catch (error) {
      console.error('Ошибка при обновлении акции:', error);
      setErrorMessage(error.response?.data?.message || 'Ошибка при обновлении акции');
    }
  };

  const handleDeletePromotion = async (id) => {
    try {
      await deletePromotion(id);
      loadPromotions();
      setErrorMessage(''); 
    } catch (error) {
      console.error('Ошибка при удалении акции:', error);
      setErrorMessage(error.message || 'Ошибка при удалении акции');
    }
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
    setErrorMessage(''); 
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewPromotion({
      title: '',
      description: '',
      type: 'Скидка',
      validUntil: dayjs(),
      discountPercentage: 0,
      isActive: true,
    });
    setCreateErrors({
      title: false,
      description: false,
      discountPercentage: false,
    });
    setErrorMessage(''); 
  };

  const handleOpenEdit = (promotion) => {
    setSelectedPromotion({
      ...promotion,
      validUntil: dayjs(promotion.validUntil),
    });
    setOpenEdit(true);
    setEditErrors({
      title: false,
      description: false,
      discountPercentage: false,
    });
    setErrorMessage(''); 
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedPromotion(null);
    setEditErrors({
      title: false,
      description: false,
      discountPercentage: false,
    });
    setErrorMessage(''); 
  };

  const handleChangeCreate = (e) => {
    let value = e.target.value;
    const { name } = e.target;

    if (name === "discountPercentage") {
      value = Math.max(0, Math.min(99, value));
    }

    setNewPromotion({ ...newPromotion, [name]: value });
    setCreateErrors({ ...createErrors, [name]: false });
    setErrorMessage(''); 
  };

  const handleChangeEdit = (e) => {
    let value = e.target.value;
    const { name } = e.target;

    if (name === "discountPercentage") {
      value = Math.max(0, Math.min(99, value));
    }

    setSelectedPromotion({ ...selectedPromotion, [name]: value });
    setEditErrors({ ...editErrors, [name]: false });
    setErrorMessage(''); 
  };

  const handleDateChangeCreate = (date) => {
    setNewPromotion({ ...newPromotion, validUntil: date });
    setErrorMessage(''); 
  };

  const handleDateChangeEdit = (date) => {
    setSelectedPromotion({ ...selectedPromotion, validUntil: date });
    setErrorMessage(''); 
  };

  const handleIsActiveChangeEdit = (event) => {
    setSelectedPromotion({ ...selectedPromotion, isActive: event.target.checked });
    setErrorMessage(''); 
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Управление акциями
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenCreate}>
        Добавить акцию
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <List>
        {promotions.map((promotion) => (
          <ListItem
            key={promotion.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(promotion)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePromotion(promotion.id)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={promotion.title}
              secondary={`${promotion.description} - Действует до: ${dayjs(promotion.validUntil).format('DD.MM.YYYY')} ${!promotion.isActive ? '(Неактивна)' : ''}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={openCreate} onClose={handleCloseCreate} fullWidth maxWidth="sm">
        <DialogTitle>Создать акцию</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="title"
                label="Название"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChangeCreate}
                value={newPromotion.title}
                error={createErrors.title}
                helperText={createErrors.title ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Описание"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                onChange={handleChangeCreate}
                value={newPromotion.description}
                error={createErrors.description}
                helperText={createErrors.description ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="type-label">Тип</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={newPromotion.type}
                  onChange={handleChangeCreate}
                  label="Тип"
                >
                  <MenuItem value="Скидка">Скидка</MenuItem>
                  <MenuItem value="Промокод">Промокод</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discountPercentage"
                label="Процент скидки"
                type="number"
                fullWidth
                variant="outlined"
                onChange={handleChangeCreate}
                value={newPromotion.discountPercentage}
                InputProps={{ inputProps: { min: 0, max: 99 } }}
                error={createErrors.discountPercentage}
                helperText={createErrors.discountPercentage ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Действует до"
                  value={newPromotion.validUntil}
                  onChange={handleDateChangeCreate}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Отмена</Button>
          <Button onClick={handleCreatePromotion} variant="contained" color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Редактировать акцию</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="title"
                label="Название"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChangeEdit}
                value={selectedPromotion?.title || ''}
                error={editErrors.title}
                helperText={editErrors.title ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Описание"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                onChange={handleChangeEdit}
                value={selectedPromotion?.description || ''}
                error={editErrors.description}
                helperText={editErrors.description ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="type-label-edit">Тип</InputLabel>
                <Select
                  labelId="type-label-edit"
                  name="type"
                  value={selectedPromotion?.type || 'Скидка'}
                  onChange={handleChangeEdit}
                  label="Тип"
                >
                  <MenuItem value="Скидка">Скидка</MenuItem>                  
                  <MenuItem value="Промокод">Промокод</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discountPercentage"
                label="Процент скидки"
                type="number"
                fullWidth
                variant="outlined"
                onChange={handleChangeEdit}
                value={selectedPromotion?.discountPercentage || 0}
                InputProps={{ inputProps: { min: 0, max: 99 } }}
                error={editErrors.discountPercentage}
                helperText={editErrors.discountPercentage ? "Поле обязательно для заполнения" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Действует до"
                  value={selectedPromotion?.validUntil || null}
                  onChange={handleDateChangeEdit}
                  renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={selectedPromotion?.isActive || false} onChange={handleIsActiveChangeEdit} />}
                label="Активна"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Отмена</Button>
          <Button onClick={handleUpdatePromotion} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PromotionManagementPage;