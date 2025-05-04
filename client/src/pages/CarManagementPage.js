import React from "react"
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Typography,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  fetchCars,
  addCar,
  updateCar,
  deleteCar
} from "../api/carApi"
import { observer } from "mobx-react-lite"
import CompanyStore from "../stores/CompanyStore"

function CarManagementPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [cars, setCars] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editData, setEditData] = React.useState({ load_capacity: "", rent_price: "", companyId: "" })
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" })
  const [search, setSearch] = React.useState("")

  const [loadCapacityError, setLoadCapacityError] = React.useState("");
  const [rentPriceError, setRentPriceError] = React.useState("");
  const [companyIdError, setCompanyIdError] = React.useState("");

  React.useEffect(() => {
    loadCars()
    CompanyStore.loadCompanies()
  }, [])

  async function loadCars() {
    setLoading(true)
    try {
      const data = await fetchCars()
      setCars(data)
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setEditData({ load_capacity: "", rent_price: "", companyId: "" });
    setDialogOpen(true);
  }

  function handleEdit(car) {
    setEditData(car)
    setDialogOpen(true)
  }

  async function handleDelete(id) {
    await deleteCar(id)
    setSnackbar({ open: true, message: "Car deleted", severity: "success" })
    loadCars()
  }

  async function handleDialogSubmit() {

    setLoadCapacityError("");
    setRentPriceError("");
    setCompanyIdError("");

    let hasErrors = false;

    if (!editData.load_capacity) {
      setLoadCapacityError("Пожалуйста, введите грузоподъемность.");
      hasErrors = true;
    } else if (isNaN(Number(editData.load_capacity))) {
      setLoadCapacityError("Грузоподъемность должна быть числом.");
      hasErrors = true;
    }

    if (!editData.rent_price) {
      setRentPriceError("Пожалуйста, введите цену аренды.");
      hasErrors = true;
    } else if (isNaN(Number(editData.rent_price))) {
      setRentPriceError("Цена аренды должна быть числом.");
      hasErrors = true;
    }

    if (!editData.companyId) {
      setCompanyIdError("Пожалуйста, выберите компанию.");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    if (editData && editData.id) {
      await updateCar(editData.id, {
        load_capacity: Number(editData.load_capacity),
        rent_price: Number(editData.rent_price),
        companyId: editData.companyId
      })
      setSnackbar({ open: true, message: "Car updated", severity: "success" })
    } else {
      await addCar({
        load_capacity: Number(editData.load_capacity),
        rent_price: Number(editData.rent_price),
        companyId: editData.companyId
      })
      setSnackbar({ open: true, message: "Car added", severity: "success" })
    }
    setDialogOpen(false)
    loadCars()
  }

  function handleDialogChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  function handleCompanyChange(e) {
    setEditData({ ...editData, companyId: e.target.value })
  }

  function handleSnackbarClose() {
    setSnackbar({ ...snackbar, open: false })
  }

  const filteredCars = cars.filter(
    c =>
      String(c.load_capacity).includes(search) ||
      String(c.rent_price).includes(search) ||
      String(c.id).includes(search)
  )

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant={isMobile ? "h6" : "h4"}>Car Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Car
        </Button>
      </Box>
      <Box mb={2}>
        <TextField
          label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Load Capacity</TableCell>
              <TableCell>Rent Price</TableCell>
              <TableCell>Company ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCars.map(car => (
              <TableRow key={car.id}>
                <TableCell>{car.id}</TableCell>
                <TableCell>{car.load_capacity}</TableCell>
                <TableCell>{car.rent_price}</TableCell>
                <TableCell>{car.companyId}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(car)} size={isMobile ? "small" : "medium"}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(car.id)} size={isMobile ? "small" : "medium"}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editData && editData.id ? "Edit Car" : "Add Car"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Load Capacity"
            name="load_capacity"
            type="number"
            value={editData?.load_capacity || ""}
            onChange={handleDialogChange}
            fullWidth
            required
            error={!!loadCapacityError}
            helperText={loadCapacityError}
          />
          <TextField
            margin="dense"
            label="Rent Price"
            name="rent_price"
            type="number"
            value={editData?.rent_price || ""}
            onChange={handleDialogChange}
            fullWidth
            required
            error={!!rentPriceError}
            helperText={rentPriceError}
          />
          <FormControl margin="dense" fullWidth required error={!!companyIdError}>
            <InputLabel id="company-select-label">Company</InputLabel>
            <Select
              labelId="company-select-label"
              value={editData?.companyId || ""}
              label="Company"
              onChange={handleCompanyChange}
              name="companyId"
            >
              {CompanyStore.companies.map(company => (
                <MenuItem key={company.id} value={company.id}>{company.id}</MenuItem>
              ))}
            </Select>
            {companyIdError && <FormHelperText>{companyIdError}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDialogSubmit}>
            {editData && editData.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default observer(CarManagementPage)