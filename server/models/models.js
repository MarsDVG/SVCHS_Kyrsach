const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
    email: {type: DataTypes.STRING, unique:true, allowNull: false, },
    password: {type: DataTypes.STRING, allowNull: false,},
    role: {type: DataTypes.STRING,  defaultValue: "USER",},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
})

const Basket_company = sequelize.define('basket_company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    workers: {type: DataTypes.INTEGER, allowNull: false, },
})

const Company = sequelize.define('company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    img: {type: DataTypes.STRING, allowNull: false, },   
})

const Company_info = sequelize.define('company_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    description: {type: DataTypes.STRING, allowNull: false, },
    name: {type: DataTypes.STRING, allowNull: false, },
})

const Company_rating = sequelize.define('company_rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
    rate: {type: DataTypes.INTEGER, allowNull: false, },
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

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Company_rating)
Company_rating.belongsTo(User)

User.hasMany(Favorites)
Favorites.belongsTo(User)

Basket.hasMany(Basket_company)
Basket_company.belongsTo(Basket)

Company.hasMany(Basket_company)
Basket_company.belongsTo(Company)

Company.hasOne(Company_info)
Company_info.belongsTo(Company)

Company.hasMany(Company_rating)
Company_rating.belongsTo(Company)

Company.hasMany(Favorites)
Favorites.belongsTo(Company)

Company.hasMany(Car)
Car.belongsTo(Company)

Company.hasMany(Driver)
Driver.belongsTo(Company)

module.exports = {
    User,
    Basket,
    Basket_company,
    Company,
    Company_info,
    Company_rating,
    Favorites,
    Car,
    Driver
}