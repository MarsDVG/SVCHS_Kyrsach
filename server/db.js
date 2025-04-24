const {Sequelize} = require('sequelize')
require('dotenv').config()

module.exports = new Sequelize(
    process.env.DB_NAME,    //Название БД
    process.env.DB_USER,    //Имя пользователя
    process.env.DB_PASSWORD, //Пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)