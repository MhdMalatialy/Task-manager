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
app.use(express.json())
app.use(userRauter)
app.use(taskRauter)

app.listen((process.env.PORT || 5000),function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });