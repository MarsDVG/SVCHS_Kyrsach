import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { fetchCompanies } from "../api/companyApi";
import { fetchCars } from "../api/carApi";
import api from "../api/index";
import { observer } from "mobx-react-lite";
import OrderWeightCalculator from "../components/OrderWeightCalculator";
import { fetchPromotions } from "../api/promotionApi";

const OrderCreatePage = observer(({ authStore }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = React.useState(null);
  const [cars, setCars] = React.useState([]);
  const [selectedCarIds, setSelectedCarIds] = useState([]);
  const [workers, setWorkers] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", error: false });
  const [loading, setLoading] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState("");
  const [promotions, setPromotions] = React.useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [activeDiscount, setActiveDiscount] = useState(null); 
  const [discountFromSale, setDiscountFromSale] = useState(0); 

  useEffect(() => {
    loadCompany();
    loadCars();
    loadPromotions();
  }, []);

  useEffect(() => {
    const totalRentPrice = selectedCarIds.reduce((sum, carId) => {
      const car = cars.find((car) => car.id === carId);
      return car ? sum + car.rent_price : sum;
    }, 0);
    setOriginalPrice(totalRentPrice);
  }, [selectedCarIds, cars]);

  useEffect(() => {
    let newDiscountedPrice = originalPrice;

    if (discountPercentage > 0) {
      newDiscountedPrice = newDiscountedPrice * (1 - discountPercentage / 100);
    }

    if (discountFromSale > 0) {
      newDiscountedPrice = newDiscountedPrice * (1 - discountFromSale / 100);
    }
    setDiscountedPrice(newDiscountedPrice);
  }, [discountPercentage, originalPrice, discountFromSale]);

  async function loadCompany() {
    const data = await fetchCompanies();
    const found = Array.isArray(data)
      ? data.find((c) => String(c.id) === String(companyId))
      : null;
    setCompany(found || null);
  }

  async function loadCars() {
    const data = await fetchCars();
    setCars(
      Array.isArray(data)
        ? data.filter((car) => String(car.companyId) === String(companyId))
        : []
    );
  }

  async function loadPromotions() {
    try {
      const response = await fetchPromotions();
      if (response && Array.isArray(response)) {
        const validPromotions = response.filter(
          (promo) => promo.type === "Промокод" && promo.isActive
        );
        setPromotions(validPromotions);

        const activeSale = response.find(
          (promo) => promo.type === "Скидка" && promo.isActive
        );
        if (activeSale) {
          setActiveDiscount(activeSale);
          setDiscountFromSale(activeSale.discountPercentage);
        } else {
          setActiveDiscount(null);
          setDiscountFromSale(0);
        }
      } else {
        console.error("Failed to load promotions or invalid format");
        setPromotions([]);
        setActiveDiscount(null);
        setDiscountFromSale(0);
      }
    } catch (error) {
      console.error("Error loading promotions:", error);
      setPromotions([]);
      setActiveDiscount(null);
      setDiscountFromSale(0);
    }
  }

  const applyPromoCode = () => {
    const matchedPromotion = promotions.find(
      (promo) => promo.type === "Промокод" && promo.description === promoCode
    );
    if (matchedPromotion) {
      setDiscountPercentage(matchedPromotion.discountPercentage);
      setSnackbar({
        open: true,
        message: `Промокод "${promoCode}" активирован! Скидка: ${matchedPromotion.discountPercentage}%`,
        error: false,
      });
    } else {
      setDiscountPercentage(0);
      setSnackbar({
        open: true,
        message: "Промокод не найден или недействителен",
        error: true,
      });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = authStore.getUserData();
      const userId = userData?.id;

      await api.post("/list/add", {
        companyId,
        userId,
        workers,
        promoCode,
        discountPercentage,
        discountedPrice,
        originalPrice,
        selectedCarIds,
      });
      setSnackbar({ open: true, message: "Заказ успешно создан", error: false });
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.log(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Ошибка создания заказа",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCarsCalculated = (carIds) => {
    setSelectedCarIds(carIds);
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={2}>
      <OrderWeightCalculator cars={cars} onCarsCalculated={handleCarsCalculated} />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Оформление заказа
        </Typography>
        {company && (
          <Box mb={2}>
            <Typography variant="subtitle1">
              Компания: {company.name} (ID: {companyId})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company.description}
            </Typography>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Typography variant="h6">
            Цена:
            <Typography
              variant="body1"
              component="span"
              sx={{ textDecoration: discountPercentage > 0 || discountFromSale > 0 ? "line-through" : "none", ml: 1 }}
            >
              {originalPrice}
            </Typography>
            {discountPercentage > 0 || discountFromSale > 0 ? (
              <Typography variant="h6" component="span" sx={{ ml: 1, color: "success.main" }}>
                {discountedPrice.toFixed(2)}
              </Typography>
            ) : null}
          </Typography>
          {activeDiscount && (
            <Typography variant="subtitle2" color="success" mt={1}>
              Акция: {activeDiscount.description} - Скидка {activeDiscount.discountPercentage}%
            </Typography>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={applyPromoCode}
            sx={{ mt: 2 }}
          >
            Применить промокод
          </Button>
          {discountPercentage > 0 && (
            <Typography variant="subtitle2" color="success" mt={1}>
              Скидка по промокоду: {discountPercentage}%
            </Typography>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel id="workers-label">Нужны рабочие?</InputLabel>
            <Select
              labelId="workers-label"
              value={workers ? "yes" : "no"}
              label="Нужны рабочие?"
              onChange={(e) => setWorkers(e.target.value === "yes")}
              required
            >
              <MenuItem value="yes">Да</MenuItem>
              <MenuItem value="no">Нет</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Оформить заказ
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { background: snackbar.error ? "#d32f2f" : "#2e7d32", color: "#fff" },
        }}
      />
    </Box>
  );
});

export default OrderCreatePage;