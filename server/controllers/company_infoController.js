const { Company_info } = require('../models/models')

class CompanyInfoController {
    async create(req, res) {
        try {
                const { name, description, companyId } = req.body;
                
            const existingCompanies = await Company_info.findAll({
                attributes: ['id'],
            });
    
            const existingIds = existingCompanies.map(company => company.id);
            
            
            let newId = 1; 
            while (existingIds.includes(newId)) {
                newId++;
            }
    
            
            const newCompany = await Company_info.create({ id: newId, name, description, companyId });
            return res.status(201).json(newCompany);
            }
        catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при создании"})
        }
    }

    async getAll(req, res) {
        try {
            const companyInfo = await Company_info.findAll();
            return res.json(companyInfo);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при получении"})
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const companyInfo = await Company_info.findOne({where:{companyId: Number(id)}});
            return res.json(companyInfo);
        } catch (e) {
            res.status(500).json({message: "Ошибка при получении"})
        }
    }

    async update(req, res) {
        try {
            const {id} = req.params;
            const {name, description} = req.body;
            await Company_info.update({name, description}, {where:{id}})
            return res.json({message: "Успешно обновлено"})
        } catch (e) {
            res.status(500).json({message: "Ошибка при обновлении"})
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await Company_info.destroy({where:{id}});
            return res.json({message: "Успешно удалено"})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при удалении"})
        }
    }
}

module.exports = new CompanyInfoController();