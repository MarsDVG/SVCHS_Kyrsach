const Router = require('express')
const router = new Router()
const driversController = require('../controllers/driversController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), driversController.create)
router.get('/', driversController.getAll)
router.get('/:id', driversController.getOne)
router.put('/:id', checkRoleMiddleware('ADMIN'), driversController.update)
router.delete('/:id', checkRoleMiddleware('ADMIN'), driversController.delete)

module.exports = router;