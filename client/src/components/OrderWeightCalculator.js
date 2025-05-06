import React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function OrderWeightCalculator({ cars, onCarsCalculated }) {
  const [weight, setWeight] = React.useState("");
  const [result, setResult] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  function handleCalculate() {
    if (!weight || isNaN(weight) || Number(weight) <= 0) {
      setResult({ error: "Введите корректный вес" });
      onCarsCalculated([]);
      return;
    }

    const w = Number(weight);
    const suitableCars = findSuitableCarCombinations(cars, w);

    if (suitableCars.length > 0) {
      suitableCars.sort((a, b) => calculateTotalRent(a) - calculateTotalRent(b));
      setResult({ cars: suitableCars[0] });
      const carIds = suitableCars[0].map((car) => car.id);
      console.log("Выбранные ID автомобилей:", carIds);
      onCarsCalculated(carIds);
    } else {
      setResult({ error: "Нет подходящих автомобилей" });
      onCarsCalculated([]);
    }
  }

  function findSuitableCarCombinations(cars, weight) {
    const combinations = [];
    const findCombinationsRecursive = (index, currentCombination, currentWeight) => {
      if (currentWeight >= weight) {
        combinations.push(currentCombination);
        return;
      }
      if (index >= cars.length) {
        return;
      }

      findCombinationsRecursive(index + 1, currentCombination, currentWeight);

      findCombinationsRecursive(
        index + 1,
        [...currentCombination, cars[index]],
        currentWeight + cars[index].load_capacity
      );
    };

    findCombinationsRecursive(0, [], 0);
    return combinations;
  }

  function calculateTotalRent(cars) {
    return cars.reduce((sum, car) => sum + car.rent_price, 0);
  }

  return (
    <Fade in>
      <Box mb={4}>
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 2 : 4,
            background: `linear-gradient(135deg, #1976d2 60%, #fff 100%)`,
            borderRadius: 4,
            boxShadow: "0 6px 30px 0 rgba(25, 118, 210, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <LocalShippingIcon sx={{ fontSize: isMobile ? 32 : 48, color: "#fff" }} />
            <Typography variant={isMobile ? "h6" : "h4"} color="#fff" fontWeight={700}>
              Калькулятор перевозки
            </Typography>
          </Box>
          <Typography variant="body1" color="#fff" mb={2}>
            Введите вес груза, чтобы подобрать подходящий автомобиль и узнать стоимость перевозки
          </Typography>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            alignItems={isMobile ? "stretch" : "center"}
          >
            <Box flex={1}>
              <Typography
                sx={{
                  color: "#1976d2",
                  fontWeight: 700,
                  fontSize: isMobile ? 16 : 18,
                  mb: 0.5,
                  ml: 0.5,
                }}
              >
                Вес груза (кг)
              </Typography>
              <TextField
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1 },
                  sx: {
                    bgcolor: "#f5faff",
                    borderRadius: 2,
                    fontSize: isMobile ? 18 : 20,
                    fontWeight: 600,
                    boxShadow: "0 2px 12px 0 rgba(25,118,210,0.07)",
                    color: "#222",
                  },
                }}
                fullWidth
                sx={{
                  borderRadius: 2,
                  "& fieldset": { borderColor: "#1976d2", borderWidth: 2 },
                  "&:hover fieldset": { borderColor: "#1565c0" },
                  "& input": { color: "#222" },
                  mt: 0.5,
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCalculate}
              sx={{
                minWidth: 160,
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                boxShadow: 3,
                height: isMobile ? 48 : 56,
                alignSelf: isMobile ? "stretch" : "end",
              }}
              size={isMobile ? "medium" : "large"}
            >
              Рассчитать
            </Button>
          </Box>
          {result && (
            <Box mt={3}>
              {result.error && (
                <Typography color="#d32f2f" fontWeight={600} fontSize={isMobile ? 16 : 18}>
                  {result.error}
                </Typography>
              )}
              {result.cars && (
                <Box>
                  <Typography variant="h6" mb={1} fontWeight={700}>
                    Подходящие автомобили:
                  </Typography>
                  <Grid container spacing={2}>
                    {result.cars.map((car) => (
                      <Grid item xs={12} sm={6} md={4} key={car.id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: 6,
                            transition: "0.2s",
                            ":hover": { boxShadow: 12, transform: "scale(1.03)" },
                          }}
                        >
                          {car.img && (
                            <CardMedia
                              component="img"
                              height="120"
                              image={car.img}
                              alt={car.name || `Автомобиль ${car.id}`}
                              sx={{ objectFit: "cover" }}
                            />
                          )}
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {car.name || `Автомобиль №${car.id}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Грузоподъемность: {car.load_capacity} кг
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Стоимость аренды: {car.rent_price} ₽
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Fade>
  );
}