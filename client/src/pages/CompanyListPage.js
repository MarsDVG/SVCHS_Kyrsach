import React from "react"
import {
  Box,
  Grid,
  List,
  Card,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material"
import { fetchCompanies } from "../api/companyApi"
import { fetchCars } from "../api/carApi"
import { fetchAllCompanyInfo } from "../api/company_infoApi"
import { addFavoriteCompany } from "../api/favoritesApi"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import InfoIcon from "@mui/icons-material/Info"
import CompanyInfoDialog from "../components/CompanyInfoDialog"

const CompanyListPage = observer(({ authStore }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [companies, setCompanies] = React.useState([])
  const [cars, setCars] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [companyInfos, setCompanyInfos] = React.useState([])
  const navigate = useNavigate()

  React.useEffect(() => {
    loadCompanies()
    loadCars()
    fetchAllCompanyInfo().then(setCompanyInfos)
  }, [])

  async function loadCompanies() {
    setLoading(true)
    try {
      const data = await fetchCompanies()
      setCompanies(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  async function loadCars() {
    try {
      const data = await fetchCars()
      setCars(Array.isArray(data) ? data : [])
    } catch {}
  }

  async function loadCompanyInfos() {
    try {
      const data = await fetchAllCompanyInfo()
      setCompanyInfos(Array.isArray(data) ? data : [])
    } catch {}
  }
  
  return (
    <Box p={isMobile ? 1 : 3}>
      <Typography variant={isMobile ? "h6" : "h4"} mb={3}>
        Компании
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {companies.map(company => {
            const companyCars = cars.filter(car => car.companyId === company.id)
            const companyInfo = companyInfos.find(info => info.companyId === company.id)
            return (
              <Grid key={company.id} item xs={12} sm={6} md={4}>
                <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
                  <CardMedia
                    component="img"
                    image={company.img}
                    alt="Company"
                    sx={{ width: "100%", height: 180, objectFit: "cover", mb: 2, borderRadius: 2 }}
                  />
                  <Box sx={{ width: "100%", mb: 1 }}>
                    {companyInfo && (
                      <>
                        <Typography variant="subtitle2">Название: {companyInfo.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Описание: {companyInfo.description}</Typography>
                      </>
                    )}
                    <Typography variant="subtitle2">Доступные машины:</Typography>
                    {companyCars.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">Нет машин</Typography>
                    ) : 
                      companyCars.map(car => (
                        <Box key={car.id}>
                          <Typography variant="body2" key={car.id}>
                            {car.id}
                          </Typography>
                          <List>
                            <Typography variant="body2" key={car.id}>
                              Грузоподъемность - {car.load_capacity}
                            </Typography>
                            <Typography variant="body2" key={car.id}>
                              Цена аренды - {car.rent_price}
                            </Typography>
                          </List>
                        </Box>
                      ))
                    }
                  </Box>
                  <CardActions sx={{ width: "100%", justifyContent: "center", flexDirection: 'column'}}>
                    <Button variant="contained" fullWidth onClick={() => navigate(`/order/create/${company.id}`)}>
                      Заказать грузоперевозку
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => {
                      const userData = authStore.getUserData();
                      const userId = userData && (userData.id || userData.userId || userData.email || userData._id);
                      addFavoriteCompany(userId, company.id)
                    }}>
                      Добавить в избранное
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
})

export default CompanyListPage
