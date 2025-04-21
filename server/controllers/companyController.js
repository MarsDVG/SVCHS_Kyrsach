const { Company, Company_info } = require('../models/models');

class CompanyController {
    async createCompany(req, res) {
        try {
            const { id, img } = req.body;
            const newCompany = await Company.create({ id, img });
            return res.status(201).json(newCompany);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при создании компании", error });
        }
    }

    async getAllCompanies(req, res) {
        try {
            const companies = await Company.findAll();
            return res.status(200).json(companies);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при получении компаний", error });
        }
    }

    async getCompanyById(req, res) {
        const { id } = req.params;
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                return res.status(404).json({ message: "Компания не найдена" });
            }
            return res.status(200).json(company);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при получении компании", error });
        }
    }

    async updateCompany(req, res) {
        const { id } = req.params;
        const { img } = req.body;
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                return res.status(404).json({ message: "Компания не найдена" });
            }
            company.img = img;
            await company.save();
            return res.status(200).json(company);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при обновлении компании", error });
        }
    }

    async deleteCompany(req, res) {
        const { id } = req.params;
        try {
            const companyInfo = await Company_info.findOne({ where: { companyId: id } });
            if (!companyInfo) {
                return res.status(404).json({ message: "Компания не" });
            }
            await Company_info.destroy({
                where: { companyId: id }
            });

            const company = await Company.findByPk(id);
            if (!company) {
                return res.status(404).json({ message: "Компания не найдена" });
            }
            await Company.destroy({
                where: { id: id }
            });

            

            return res.status(204).json(); // Успешное удаление
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Ошибка при удалении компании" });
        }
    }
}

module.exports = new CompanyController();