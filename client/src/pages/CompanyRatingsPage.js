import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Rating, TextField, Snackbar, CircularProgress } from '@mui/material'
import { useState } from 'react'
import companyStore from '../stores/CompanyStore'
import authStore from '../stores/AuthStore'
import { fetchCompanyRatingsByCompanyId, createCompanyRating } from '../api/companyRatingsApi'
import { useTheme } from '@mui/material/styles'
import { fetchCompanyInfoById } from '../api/company_infoApi'
import InfoIcon from '@mui/icons-material/Info'
import CompanyInfoDialog from '../components/CompanyInfoDialog'
import { fetchCompanies } from '../api/companyApi'
import { fetchCompanyRatings } from '../api/companyRatingsApi'
import { saveAs } from "file-saver"

const CompanyRatingsPage = observer(() => {
  const theme = useTheme()
  const [ratings, setRatings] = useState({})
  const [loadingRatings, setLoadingRatings] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const [form, setForm] = useState({})
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [infoCompanyId, setInfoCompanyId] = useState(null)
  const [csvLoading, setCsvLoading] = useState(false)

  useEffect(() => {
    companyStore.loadCompanies()
  }, [])

  const handleOpenSnackbar = (message) => {
    setSnackbar({ open: true, message })
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' })
  }
  const handleRatingChange = (companyId, value) => {
    setForm((prev) => ({ ...prev, [companyId]: { ...prev[companyId], rate: value } }))
  }
  const handleCommentChange = (companyId, value) => {
    setForm((prev) => ({ ...prev, [companyId]: { ...prev[companyId], comment: value } }))
  }
  const handleSubmit = async (companyId) => {
    try {
      const userData = authStore.getUserData()
      await createCompanyRating({ companyId, rate: form[companyId]?.rate, comment: form[companyId]?.comment, userId: userData?.id })
      handleOpenSnackbar('Отзыв успешно добавлен')
      loadRatings(companyId)
      setForm((prev) => ({ ...prev, [companyId]: {} }))
    } catch (e) {
      handleOpenSnackbar('Ошибка при добавлении отзыва')
    }
  }
  const loadRatings = async (companyId) => {
    setLoadingRatings(true)
    try {
      const data = await fetchCompanyRatingsByCompanyId(companyId)
      setRatings((prev) => ({ ...prev, [companyId]: data }))
    } catch (e) {
      setRatings((prev) => ({ ...prev, [companyId]: [] }))
    } finally {
      setLoadingRatings(false)
    }
  }
  useEffect(() => {
    if (companyStore.companies.length > 0) {
      companyStore.companies.forEach((company) => {
        loadRatings(company.id)
      })
    }
    // eslint-disable-next-line
  }, [companyStore.companies.length])
  const handleOpenInfo = (companyId) => {
    setInfoCompanyId(companyId)
    setInfoDialogOpen(true)
  }
  const handleCloseInfo = () => {
    setInfoDialogOpen(false)
    setInfoCompanyId(null)
  }

  const handleCsvExport = async () => {
    setCsvLoading(true)
    try {
      const companies = companyStore.companies
      const ratingsData = await fetchCompanyRatings()
      const header = ["company", "rate", "comment"]
      const rows = []
      companies.forEach(company => {
        const companyRatings = ratingsData.filter(r => r.companyId === company.id)
        if (companyRatings.length === 0) {
          rows.push([company.name, '', ''])
        } else {
          companyRatings.forEach(rating => {
            rows.push([company.name, rating.rate, rating.comment])
          })
        }
      })
      let csv = header.join(",") + "\n" + rows.map(r => r.map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val).join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      saveAs(blob, `company_ratings_report_${new Date().toISOString().slice(0,10)}.csv`)
      setSnackbar({ open: true, message: 'CSV отчёт сформирован' })
    } catch (e) {
      setSnackbar({ open: true, message: 'Ошибка при формировании отчёта' })
    } finally {
      setCsvLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>Рейтинги и отзывы компаний</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" onClick={handleCsvExport} disabled={csvLoading}>
          {csvLoading ? <CircularProgress size={20} /> : 'Создать CSV отчёт'}
        </Button>
      </Box>
      {companyStore.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {companyStore.companies.map((company) => (
            <Grid item xs={12} sm={6} key={company.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>{company.name || `Компания #${company.id}`}</Typography>
                  <Box sx={{ mb: 1 }}>
                    <Rating
                      value={form[company.id]?.rate || 0}
                      onChange={(_, value) => handleRatingChange(company.id, value)}
                      precision={1}
                    />
                  </Box>
                  <Button
                      variant="contained"
                      onClick={() => handleSubmit(company.id)}
                      disabled={!form[company.id]?.rate}
                    >
                      Оставить отзыв
                    </Button>
                  <CardActions>
                    <Button size="small" onClick={() => handleOpenInfo(company.id)} startIcon={<InfoIcon />}>
                      Инфо
                    </Button>
                  </CardActions>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Отзывы:</Typography>
                    {loadingRatings ? (
                      <CircularProgress size={24} />
                    ) : (
                      ratings[company.id]?.length > 0 ? (
                        ratings[company.id].map((r, idx) => (
                          <Box key={idx} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: theme.palette.grey[100] }}>
                            <Rating value={r.rate} readOnly size="small" />
                            <Typography variant="body2">{r.comment}</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">Нет отзывов</Typography>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <CompanyInfoDialog companyId={infoCompanyId} open={infoDialogOpen} onClose={handleCloseInfo} />
    </Container>
  )
})

export default CompanyRatingsPage
