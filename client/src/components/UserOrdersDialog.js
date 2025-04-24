import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Typography
} from "@mui/material"
import { saveAs } from "file-saver"
import { fetchUserOrders } from "../api/listApi"

function arrayToCsv(data) {
  if (!data.length) return ""
  const header = Object.keys(data[0]).join(",")
  const rows = data.map(row =>
    Object.values(row)
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  )
  return [header, ...rows].join("\r\n")
}

export default function UserOrdersDialog({ open, onClose, userId, userName }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && userId) {
      setLoading(true)
      fetchUserOrders(userId)
        .then(res => setOrders(res))
        .catch(error => {
            console.error('Ошибка загрузки заказов:', error)
            setOrders([])
        })
        .finally(() => setLoading(false))
    }
  }, [open, userId])

  const handleExport = () => {
    if (!orders.length) return
    const csv = arrayToCsv(orders)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    saveAs(blob, `orders_${userName || userId}.csv`)
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
      <DialogTitle>Заказы пользователя {userName || userId}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : orders.length ? (
          <TableContainer>
            <Table size={fullScreen ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {Object.keys(orders[0]).map(key => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, idx) => (
                  <TableRow key={order.id || idx}>
                    {Object.values(order).map((val, i) => (
                      <TableCell key={i}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2">Нет заказов</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExport} disabled={!orders.length}>Экспортировать</Button>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  )
}