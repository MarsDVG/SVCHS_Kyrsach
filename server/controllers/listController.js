const {Company,List,List_company} = require('../models/models')
const ApiError = require('../error/ApiError')

class ListController {
  async addToList(req, res, next) {
    try {
      const { companyId, userId, workers } = req.body;

        const orders = await Company.findByPk(companyId);
        console.log()
        if (!companyId) {
            return res.status(404).json({ message: "Заказ не найден", orders });
        }

        let list = await List.findOne({ where: { id:userId } });
        if (!list) {
            list = await List.create({ id:userId });
        }

        const listStuff = await List_company.findOne({
          where: { listId: list.id, companyId }
      });
        if (listStuff) {
            return res.status(400).json({ message: "Заказ уже активен" });
        }

      
        const newStuffinList = await List_company.create({
          listId: list.id,
          companyId,
          workers 
      });

        return res.json({ message: "Заказ добавлен в список", listStuff: newStuffinList });
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}
  
async getList(req, res) {
  try {
    const { userId } = req.params;
  
    const list = await List.findOne({ where: { id:userId } });

    if (!list) {
      return res.status(404).json({ message: 'Список не найден' });
    }

    const listStuff = await List_company.findAll({
      where: { listId: list.id },  
    });

    const orderIds = listStuff.map(item => item.orderId);

    

    return res.json(orderIds);
  } catch (error) {
    console.error('Ошибка получения списка:', error);
    return res.status(500).json({ message: 'Ошибка получения списка' });
  }
}

async getListId(req, res) {
  try {
    const { userId } = req.params;  

    const list = await List.findOne({
      where: { userId },  
    });

    if (!list) {
      return res.status(404).json({ message: 'Список не найден' });
    }

    return res.json({ listId: list.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка получения listId' });
  }
}


    
     
async removeFromList(req, res) {
  try {
    const { listId, companyId } = req.body; 
    const deleted = await List_company.destroy({
      where: { listId, companyId } 
    });

    if (deleted) {
      return res.json({ message: 'Заказ успешно отменен.' });
    } else {
      return res.status(404).json({ message: 'Заказ не найден в списке' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка удаления заказа из списка' });
  }
}


}
module.exports = new ListController()