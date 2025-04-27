import React from "react"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Typography,
  TextField,
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
} from "@mui/material"
import BlockIcon from "@mui/icons-material/Block"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DownloadIcon from "@mui/icons-material/Download"
import { saveAs } from "file-saver"
import {
  fetchUsers,
  controlUser
} from "../api/userApi"

import UserOrdersDialog from "../components/UserOrdersDialog"


function UserManagementPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" })
  const [search, setSearch] = React.useState("")
  const [banAction, setBanAction] = React.useState("")
  const [ordersDialogOpen, setOrdersDialogOpen] = React.useState(false)
const [ordersDialogUser, setOrdersDialogUser] = React.useState(null)

  React.useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenOrdersDialog(user) {
    setOrdersDialogUser(user)
    setOrdersDialogOpen(true)
  }
  function handleCloseOrdersDialog() {
    setOrdersDialogOpen(false)
    setOrdersDialogUser(null)
  }

  function handleBan(user, action) {
    setSelectedUser(user)
    setBanAction(action)
    setDialogOpen(true)
  }

  async function handleDialogSubmit() {
    if (selectedUser && banAction) {
      await controlUser(selectedUser.id, banAction)
      setSnackbar({ open: true, message: banAction === 'ban' ? "User banned" : "User unbanned", severity: "success" })
      setDialogOpen(false)
      loadUsers()
    }
  }

  function handleSnackbarClose() {
    setSnackbar({ ...snackbar, open: false })
  }

  async function handleReport() {
    setLoading(true);
    try {
        const data = await fetchUsers();
        const bannedUsers = data.filter(user => user.block);

        if (bannedUsers.length === 0) {
            setSnackbar({ open: true, message: "Нет заблокированных пользователей", severity: "info" });
            return;
        }

        const doc = new jsPDF();
        const header = ["id", "email", "role", "createdAt"];
        const body = bannedUsers.map(user => [user.id, user.email, user.role, user.createdAt]);


        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        autoTable(doc, { 
            head: [header],
            body: body,
            startY: 20
        });

        
        const blob = doc.output('blob');
        saveAs(blob, `banned_users_${new Date().toISOString().slice(0, 10)}.pdf`);

        setSnackbar({ open: true, message: "PDF отчёт создан", severity: "success" });
    } catch (error) {
        console.error("Ошибка при генерации PDF:", error);
        setSnackbar({ open: true, message: "Ошибка создания отчёта: " + error.message, severity: "error" });
    } finally {
        setLoading(false);
    }
}
  const filteredUsers = users.filter(
    u =>
      String(u.email).toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search) ||
      String(u.role).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexDirection={isMobile ? "column" : "row"}>
        <Typography variant={isMobile ? "h6" : "h4"}>User Management</Typography>
        <Box display="flex" gap={2} mt={isMobile ? 2 : 0}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleReport}
            disabled={loading}
          >
            Создать отчёт
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Button onClick={loadUsers} variant="outlined" sx={{ mr: 2 }} disabled={loading}>
          Refresh
        </Button>
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
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  {user.role !== 'ADMIN' && (
                    user.block ? (
                      <IconButton onClick={() => handleBan(user, 'unban')} size={isMobile ? "small" : "medium"}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleBan(user, 'ban')} size={isMobile ? "small" : "medium"}>
                        <BlockIcon color="error" />
                      </IconButton>
                    )
                  )}
                </TableCell>
                <TableCell>
  <Button size="small" onClick={() => handleOpenOrdersDialog(user)}>
    Заказы
  </Button>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{banAction === 'ban' ? "Ban User" : "Unban User"}</DialogTitle>
        <DialogContent>
          <Typography>
            {banAction === 'ban' ?
              `Are you sure you want to ban user ${selectedUser?.email}?` :
              `Are you sure you want to unban user ${selectedUser?.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color={banAction === 'ban' ? "error" : "success"} onClick={handleDialogSubmit}>
            {banAction === 'ban' ? "Ban" : "Unban"}
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
      <UserOrdersDialog
  open={ordersDialogOpen}
  onClose={handleCloseOrdersDialog}
  userId={ordersDialogUser?.id}
  userName={ordersDialogUser?.name || ordersDialogUser?.email}
/>
    </Box>
  )
}

export default UserManagementPage
