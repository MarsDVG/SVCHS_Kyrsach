const { Car } = require('../models/models')

class CarController {
  async getAll(req, res) {
    try {
      const cars = await Car.findAll();
      res.json(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ error: 'Произошла ошибка при получении списка автомобилей. Пожалуйста, попробуйте позже.' });
    }
  }

  async create(req, res) {
    try {
      const newCar = await Car.create(req.body); 
      res.status(201).json(newCar);
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(400).json({ error: 'Не удалось создать автомобиль. Проверьте правильность введенных данных.' });
    }
  }

  async updateCar(req, res) {
    try {
      const car = await Car.findByPk(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Автомобиль не найден.' });
      }
      await car.update(req.body); 
      res.json(car);
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(400).json({ error: 'Не удалось обновить данные автомобиля. Проверьте правильность введенных данных.' });
    }
  }

  async delete(req, res) {
    try {
      const car = await Car.findByPk(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Автомобиль не найден.' });
      }
      await car.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ error: 'Произошла ошибка при удалении автомобиля. Пожалуйста, попробуйте позже.' });
    }
  }
}


module.exports = new CarController();