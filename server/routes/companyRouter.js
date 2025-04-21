const express = require('express')
const router = express.Router()
const CompanyController = require('../controllers/companyController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')


router.post('/', checkRoleMiddleware('ADMIN'), CompanyController.createCompany)
router.get('/', CompanyController.getAllCompanies)
router.get('/:id', CompanyController.getCompanyById)
router.put('/:id', checkRoleMiddleware('ADMIN'), CompanyController.updateCompany)
router.delete('/:id', checkRoleMiddleware('ADMIN'), CompanyController.deleteCompany)

module.exports = router;