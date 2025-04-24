const {Company_rating} = require('../models/models')
const ApiError = require('../error/ApiError')

class RaitingController {
    async create(req, res, next) {
        try {
            const { rate, userId, companyId } = req.body;
            if (!rate || !userId || !companyId) {
                return next(ApiError.badRequest('All fields (rate, userId, companyId) are required.'));
            }
    
            // Проверка на существование оценки
            const existingRating = await Company_rating.findOne({ where: { userId, companyId } });
            if (existingRating) {
                return next(ApiError.badRequest('Вы уже поставили оценку этой компании.'));
            }
    
            const rating = await Company_rating.create({ rate, userId, companyId });
            return res.json(rating);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }   

    async getAll(req,res){
        const raitings = await Company_rating.findAll()
        return res.json(raitings)
    }
    async getByCompanyId(req, res, next) {
        try {
            const { companyId } = req.params; 
            if (!companyId) {
                return next(ApiError.badRequest('Company ID is required.'));
            }

            const raitings = await Company_rating.findAll({ where: { companyId } });
            return res.json(raitings); 
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
    
}

module.exports = new RaitingController()