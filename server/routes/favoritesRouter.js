const Router = require('express')
const router = new Router()
const favoritesController = require('../controllers/favoritesController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')


router.post('/', checkRoleMiddleware('USER', 'ADMIN'), favoritesController.addFavorite)
router.get('/', checkRoleMiddleware('USER', 'ADMIN'), favoritesController.getFavorites)
router.post('/remove', checkRoleMiddleware('USER', 'ADMIN'), favoritesController.deleteFavorite) 

module.exports = router