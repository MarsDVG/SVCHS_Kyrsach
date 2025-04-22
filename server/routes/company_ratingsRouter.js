const Router = require('express')
const router = new Router()
const company_ratingsController = require('../controllers/company_ratingsController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('USER','ADMIN'), company_ratingsController.create)
router.get('/', checkRoleMiddleware('USER','ADMIN'), company_ratingsController.getAll)
router.get('/:companyId', checkRoleMiddleware('USER','ADMIN'), company_ratingsController.getByCompanyId)

module.exports = router