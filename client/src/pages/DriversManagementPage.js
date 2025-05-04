import React from "react";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
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
  FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchDrivers, addDriver, updateDriver, deleteDriver } from "../api/driversApi";
import CompanyStore from "../stores/CompanyStore";

const DriversManagementPage = observer(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drivers, setDrivers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({ name: "", surname: "", number: "", companyId: "" });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

  React.useEffect(() => {
    CompanyStore.loadCompanies();
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetchDrivers();
      setDrivers(Array.isArray(res) ? res : []);
    } catch {
      setSnackbar({ open: true, message: "Ошибка загрузки водителей", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData({ name: "", surname: "", number: "", companyId: "" });
    setDialogOpen(true);
  };

  const handleEdit = (driver) => {
    setEditData({ ...driver });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDriver(id);
      setSnackbar({ open: true, message: "Водитель удалён", severity: "success" });
      loadDrivers();
    } catch {
      setSnackbar({ open: true, message: "Ошибка удаления", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSubmit = async () => {
    setLoading(true);
    try {
      if (editData.id) {
        await updateDriver(editData.id, editData);
        setSnackbar({ open: true, message: "Водитель обновлён", severity: "success" });
      } else {
        await addDriver(editData);
        setSnackbar({ open: true, message: "Водитель добавлен", severity: "success" });
      }
      setDialogOpen(false);
      loadDrivers();
    } catch {
      setSnackbar({ open: true, message: "Ошибка сохранения", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      
      const validChars = /^[0-9+]*$/;  //Валидация ввода номера, можно ввести только цифры и знак +
      if (validChars.test(value)) {
        setEditData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant={isMobile ? "h6" : "h4"}>Drivers Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Driver
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Company</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => {
                const company = CompanyStore.companies.find((c) => c.id === driver.companyId);
                return (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.surname}</TableCell>
                    <TableCell>{driver.number}</TableCell>
                    <TableCell>{company ? company.id : "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(driver)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(driver.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editData && editData.id ? "Edit Driver" : "Add Driver"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editData?.name || ""}
            onChange={handleDialogChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Surname"
            name="surname"
            value={editData?.surname || ""}
            onChange={handleDialogChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Number"
            name="number"
            value={editData?.number || ""}
            onChange={handleDialogChange}
            fullWidth
            inputProps={{ maxLength: 15 }} 
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Company</InputLabel>
            <Select
              name="companyId"
              value={editData?.companyId || ""}
              onChange={handleDialogChange}
              label="Company"
            >
              {CompanyStore.companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>{company.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained">
            {editData && editData.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default DriversManagementPage;