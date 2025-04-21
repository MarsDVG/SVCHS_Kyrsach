const { Driver } = require('../models/models')

class DriverController {
    async create(req, res) {
        try {
            const driver = await Driver.create(req.body);
            return res.json(driver);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при создании водителя" });
        }
    }

    async getAll(req, res) {
        try {
            const drivers = await Driver.findAll();
            return res.json(drivers);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при получении водителей" });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const driver = await Driver.findOne({ where: { id } });
            return res.json(driver);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при получении водителя" });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            await Driver.update(req.body, { where: { id } });
            return res.json({ message: "Водитель успешно обновлен" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при обновлении водителя" });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Driver.destroy({ where: { id } });
            return res.json({ message: "Водитель успешно удален" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Ошибка при удалении водителя" });
        }
    }
}

module.exports = new DriverController();