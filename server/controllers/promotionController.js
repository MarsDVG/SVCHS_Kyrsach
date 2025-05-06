const { Promotion } = require('../models/models');
const ApiError = require('../error/ApiError');

class PromotionController {
  async create(req, res, next) {
    try {
      const { title, description, type, validUntil, discountPercentage, isActive } = req.body;

      // Проверяем уникальность описания для промокодов
      if (type === 'Промокод') {
        const existingPromotion = await Promotion.findOne({ where: { description } });
        if (existingPromotion) {
          return next(ApiError.badRequest('Промокод с таким описанием уже существует'));
        }
      }

      const promotion = await Promotion.create({ title, description, type, validUntil, discountPercentage, isActive });
      return res.json(promotion);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    try {
      // Убираем фильтрацию по isActive
      const promotions = await Promotion.findAll({
        order: [
          ['validUntil', 'ASC'] // Сортируем по дате окончания
        ]
      });
      return res.json(promotions);
    } catch (e) {
      return res.json([]); // Возвращаем пустой массив, если произошла ошибка
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const promotion = await Promotion.findOne(
      {
        where: { id }
      },
    )
    return res.json(promotion)
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, type, validUntil, discountPercentage, isActive } = req.body;

      const promotion = await Promotion.findOne({ where: { id } });
      if (!promotion) {
        return next(ApiError.notFound('Акция не найдена'));
      }

      if (type === 'Промокод') {
        const existingPromotion = await Promotion.findOne({
          where: {
            description,
            id: { [require('sequelize').Op.ne]: id } 
          }
        });
        if (existingPromotion) {
          return next(ApiError.badRequest('Промокод с таким описанием уже существует'));
        }
      }

      await promotion.update({ title, description, type, validUntil, discountPercentage, isActive });
      return res.json(promotion);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const promotion = await Promotion.destroy({ where: { id } });

      if (promotion) {
        return res.json({ message: 'Акция успешно удалена' });
      } else {
        return next(ApiError.notFound('Акция не найдена'));
      }
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new PromotionController();