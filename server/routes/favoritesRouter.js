const Router = require('express')
const router = new Router()
const favoritesController = require('../controllers/favoritesController')


router.post('/', favoritesController.addFavorite)
router.get('/', favoritesController.getFavorites)
router.delete('/', favoritesController.deleteFavorite) 

module.exports = router