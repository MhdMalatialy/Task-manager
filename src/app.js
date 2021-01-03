require('dotenv').config({ path: './config/test.env' })
const express=require('express')
require('./db/mongoose')
const userRauter = require('./routers/user')
const taskRauter = require('./routers/task')

const app=express()
app.use(express.json())
app.use(userRauter)
app.use(taskRauter)

module.exports = app