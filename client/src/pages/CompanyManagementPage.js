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
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import CompanyInfoDialog from "../components/CompanyInfoDialog";
import { fetchCompanyInfoById } from "../api/company_infoApi";

const CompanyManagementPage = observer(({ store }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);
  const [infoCompanyId, setInfoCompanyId] = React.useState(null);

  React.useEffect(() => {
    store.loadCompanies();
  }, [store]);

  const handleAdd = () => {
    setEditData({ img: "" });
    setDialogOpen(true);
  };
  const handleEdit = (company) => {
    setEditData(company);
    setDialogOpen(true);
  };
  const handleDelete = async (id) => {
    await store.removeCompany(id);
    setSnackbar({ open: true, message: "Company deleted", severity: "success" });
  };
  const handleDialogSubmit = async (data) => {
    if (editData && editData.id) {
      await store.editCompany(editData.id, data);
      setSnackbar({ open: true, message: "Company updated", severity: "success" });
    } else {
      await store.addCompany(data);
      setSnackbar({ open: true, message: "Company added", severity: "success" });
    }
    setDialogOpen(false);
  };

  const handleOpenInfo = async (companyId) => {
    setInfoCompanyId(companyId);
    setInfoDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoDialogOpen(false);
    setInfoCompanyId(null);
  };

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant={isMobile ? "h6" : "h4"}>Company Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Company
        </Button>
      </Box>
      {store.loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>
                    {company.img ? (
                      <img src={company.img} alt="Company" style={{ maxHeight: 48, maxWidth: 120 }} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell>{company.createdAt ? new Date(company.createdAt).toLocaleString() : ""}</TableCell>
                  <TableCell>{company.updatedAt ? new Date(company.updatedAt).toLocaleString() : ""}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(company)} size={isMobile ? "small" : "medium"}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(company.id)} size={isMobile ? "small" : "medium"} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenInfo(company.id)} size={isMobile ? "small" : "medium"} color="primary">
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editData && editData.id ? "Edit Company" : "Add Company"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Company Image URL"
            fullWidth
            value={editData?.img || ""}
            onChange={(e) => setEditData({ ...editData, img: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDialogSubmit(editData)} variant="contained">
            {editData && editData.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <CompanyInfoDialog companyId={infoCompanyId} open={infoDialogOpen} onClose={handleCloseInfo}/>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {store.error && (
        <Snackbar
          open={true}
          autoHideDuration={4000}
          onClose={() => (store.error = null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {store.error.message || "Error occurred"}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
});

export default CompanyManagementPage;
