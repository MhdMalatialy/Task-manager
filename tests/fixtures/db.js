const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './config/test.env' })
const userOneId = new mongoose.Types.ObjectId()
const oneuser = {
    _id:userOneId,
    name:'test',
    email:'test@test.com',
    password:'testtest1',
    tokens: [{
        token:jwt.sign({_id: userOneId},process.env.JWTSECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const twouser = {
    _id:userTwoId,
    name:'test1',
    email:'test1@test.com',
    password:'testtest2',
    tokens: [{
        token:jwt.sign({_id: userTwoId},process.env.JWTSECRET)
    }]
}
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: oneuser._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: oneuser._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: twouser._id
}

const setupDataBase = async () => {
await User.deleteMany()
await Task.deleteMany()
await new User(oneuser).save()
await new User(twouser).save()
await new Task(taskOne).save()
await new Task(taskTwo).save()
await new Task(taskThree).save()
}

module.exports={userOneId,
    oneuser,
    setupDataBase,
    userTwoId,
    twouser,
    taskOne,
    taskTwo,
    taskThree}