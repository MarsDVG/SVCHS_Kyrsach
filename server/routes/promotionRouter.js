const Router = require('express')
const router = new Router()
const promotionController = require('../controllers/promotionController');

router.post('/', promotionController.create);
router.get('/', promotionController.getAll);
router.get('/:id', promotionController.getOne);
router.put('/:id', promotionController.update);
router.delete('/:id', promotionController.delete);

module.exports = router;