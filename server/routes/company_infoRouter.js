const Router = require('express')
const router = new Router()
const company_infoController = require('../controllers/company_infoController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), company_infoController.create)
router.get('/', company_infoController.getAll)
router.get('/:id', company_infoController.getOne)
router.put('/:id', checkRoleMiddleware('ADMIN'), company_infoController.update)
router.delete('/:id', checkRoleMiddleware('ADMIN'), company_infoController.delete)

module.exports = router