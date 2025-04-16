require('dotenv').config()
const express = require('express')

const PORT = 5000

const app = express()

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,() => console.log('Server was starting at port ${PORT}'))
    } catch (e) {
        console.log(e)
    }
}

start()