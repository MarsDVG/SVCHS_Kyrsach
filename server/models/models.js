const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
    email: {type: DataTypes.STRING, unique:true, allowNull: false, },
    password: {type: DataTypes.STRING, allowNull: false,},
    role: {type: DataTypes.STRING,  defaultValue: "USER",},
    block: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const List = sequelize.define('list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
})

const List_company = sequelize.define('list_company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    workers: {type: DataTypes.BOOLEAN, allowNull: false, },
})

const Company = sequelize.define('company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    img: {type: DataTypes.STRING, allowNull: false, },   
})

const Company_info = sequelize.define('company_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    description: {type: DataTypes.STRING, allowNull: false, },
    name: {type: DataTypes.STRING, allowNull: false, },
    companyId: { type: DataTypes.INTEGER, allowNull: false }, // Внешний ключ
})

const Company_rating = sequelize.define('company_rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    rate: {type: DataTypes.DOUBLE, allowNull: false, },
    review: {type: DataTypes.STRING, allowNull: false, },
})

const Favorites = sequelize.define('favorites', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
})

const Car = sequelize.define('car', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    load_capacity: {type: DataTypes.DOUBLE, allowNull: false, },
    rent_price: {type: DataTypes.DOUBLE, allowNull: false, },
})

const Driver = sequelize.define('driver', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    name: {type: DataTypes.STRING, allowNull: false, },
    surname: {type: DataTypes.STRING, allowNull: false, },
    number: {type: DataTypes.STRING, allowNull: false, },
})
const Promotion = sequelize.define('promotion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: "Скидка" }, 
    validUntil: { type: DataTypes.DATE, allowNull: false },
    discountPercentage: { type: DataTypes.INTEGER, defaultValue: 0 }, 
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true } 
  });

User.hasOne(List)
List.belongsTo(User)

User.hasMany(Company_rating)
Company_rating.belongsTo(User)

User.hasMany(Favorites)
Favorites.belongsTo(User)

List.hasMany(List_company)
List_company.belongsTo(List)

Company.hasMany(List_company)
List_company.belongsTo(Company)

// Company.hasOne(Company_info)
// Company_info.belongsTo(Company)

Company.hasMany(Company_rating)
Company_rating.belongsTo(Company)

Company.hasMany(Favorites)
Favorites.belongsTo(Company)

Company.hasMany(Car)
Car.belongsTo(Company)

Company.hasMany(Driver)
Driver.belongsTo(Company)

Company.hasMany(Company_info, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Company_info.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = {
    User,
    List,
    List_company,
    Company,
    Company_info,
    Company_rating,
    Favorites,
    Car,
    Driver,
    Promotion
}