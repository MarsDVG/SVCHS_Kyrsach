const express = require('express')
const router = express.Router()
const CompanyController = require('../controllers/companyController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

// Создание компании
router.post('/', checkRoleMiddleware('ADMIN'), CompanyController.createCompany)

// Получение всех компаний
router.get('/', CompanyController.getAllCompanies)

// Получение компании по ID
router.get('/:id', CompanyController.getCompanyById)

// Обновление компании
router.put('/:id', checkRoleMiddleware('ADMIN'), CompanyController.updateCompany)

// Удаление компании
router.delete('/:id', checkRoleMiddleware('ADMIN'), CompanyController.deleteCompany)

module.exports = router;