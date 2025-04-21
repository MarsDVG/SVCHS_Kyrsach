const Router = require('express')
const router = new Router()
const listController = require('../controllers/listController')

router.post('/add', listController.addToList)
router.get('/:userId', listController.getList)
router.post('/remove', listController.removeFromList)
router.get('/list/:userId', listController.getListId)

module.exports = router