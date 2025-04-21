const { Favorites } = require('../models/models')

class FavoritesController {
    async addFavorite(req, res) {
        try {
            const { companyId } = req.body; 
            const userId = req.user.id; 

            const existingFavorite = await Favorites.findOne({ where: { userId, companyId } });
            if (existingFavorite) {
                return res.status(400).json({ message: "Компания уже добавлена в избранное" });
            }

            const favorite = await Favorites.create({ userId, companyId });
            return res.json(favorite);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при добавлении в избранное" });
        }
    }

    async getFavorites(req, res) {
        try {
            const userId = req.user.id; 
            const favorites = await Favorites.findAll({ where: { userId } });
            return res.json(favorites);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при получении избранного" });
        }
    }

    async deleteFavorite(req, res) {
        try {
            const { companyId } = req.body; 
            const userId = req.user.id; 
            await Favorites.destroy({ where: { userId, companyId } });
            return res.json({ message: "Компания успешно удалена из избранного" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при удалении из избранного" });
        }
    }
}

module.exports = new FavoritesController();