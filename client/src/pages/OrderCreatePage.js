import React from "react"
import { useParams, useNavigate } from "react-router-dom"
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
  FormControl
} from "@mui/material"
import { fetchCompanies } from "../api/companyApi"
import { fetchCars } from "../api/carApi"
import api from "../api/index"
import { observer } from "mobx-react-lite"
import OrderWeightCalculator from "../components/OrderWeightCalculator"

const OrderCreatePage = observer(({ authStore }) => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = React.useState(null)
  const [cars, setCars] = React.useState([])
  const [selectedCar, setSelectedCar] = React.useState("")
  const [workers, setWorkers] = React.useState(false)
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", error: false })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    loadCompany()
    loadCars()
  }, [])

  async function loadCompany() {
    const data = await fetchCompanies()
    const found = Array.isArray(data) ? data.find(c => String(c.id) === String(companyId)) : null
    setCompany(found || null)
  }

  async function loadCars() {
    const data = await fetchCars()
    setCars(Array.isArray(data) ? data.filter(car => String(car.companyId) === String(companyId)) : [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const userData = authStore.getUserData()
      const userId = userData?.id
      await api.post("/list/add", {
        companyId,
        userId,
        workers
      })
      setSnackbar({ open: true, message: "Заказ успешно создан", error: false })
      setTimeout(() => navigate("/"), 1200)
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, message: err?.response?.data?.message || "Ошибка создания заказа", error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={2}>
      <OrderWeightCalculator cars={cars} />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Оформление заказа
        </Typography>
        {company && (
          <Box mb={2}>
            <Typography variant="subtitle1">Компания: {company.name} (ID: {companyId})</Typography>
            <Typography variant="body2" color="text.secondary">{company.description}</Typography>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="workers-label">Нужны рабочие?</InputLabel>
            <Select
              labelId="workers-label"
              value={workers ? "yes" : "no"}
              label="Нужны рабочие?"
              onChange={e => setWorkers(e.target.value === "yes")}
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
        ContentProps={{ sx: { background: snackbar.error ? "#d32f2f" : "#2e7d32", color: "#fff" } }}
      />
    </Box>
  )
})

export default OrderCreatePage
