const Router = require('express')
const router = new Router()
const company_ratingsController = require('../controllers/company_ratingsController')

router.post('/', company_ratingsController.create)
router.get('/', company_ratingsController.getAll)
router.get('/:goodId', company_ratingsController.getByGoodId)

module.exports = router