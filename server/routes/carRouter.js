const Router = require('express')
const router = new Router()
const checkrole = require('../middleware/checkRoleMiddleware')
const carController = require('../controllers/carController')

router.post('/',checkrole('ADMIN'),carController.create)
router.get('/',carController.getAll)
router.put('/:id',carController.updateCar)
router.delete('/:id',carController.delete)


module.exports = router