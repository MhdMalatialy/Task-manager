//-----------------------------------
require('dotenv').config({ path: './config/dev.env' })
const express=require('express')
require('./db/mongoose')
const Task=require('./models/task')
const userRauter = require('./routers/user')
const taskRauter = require('./routers/task')
const { ObjectID } = require('mongodb')
const User = require('./models/user')

const app=express()

const port=process.env.PORT 
app.use(express.json())
app.use(userRauter)
app.use(taskRauter)
app.listen(port,()=>console.log('server is up on port:'+port))