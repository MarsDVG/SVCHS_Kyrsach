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
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 


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
    if (!orders || !orders.length) {
        alert('Нет заказов для экспорта.');
        return;
    }

    try {
        const doc = new jsPDF();
        const header = Object.keys(orders[0]); 
        if (!header || header.length === 0) {
          alert('Невозможно обработать данные заказов. Проверьте формат данных.');
          return;
        }

        const body = orders.map(order => Object.values(order)); 

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        autoTable(doc, {
            head: [header],
            body: body,
            startY: 20,
            theme: 'grid',
        });

        const blob = doc.output('blob');
        saveAs(blob, `orders_${userName || userId}.pdf`);
    } catch (error) {
        console.error('Ошибка при генерации отчета:', error);
        alert('Произошла ошибка при генерации отчета. Пожалуйста, попробуйте позже.');
    }
};
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
                      <TableCell key={i}>
                      {typeof val === 'boolean' ? (val ? 'Да' : 'Нет') : val}
                    </TableCell>
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