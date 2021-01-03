const request = require('supertest') 
const {userOneId,
    oneuser,
    setupDataBase,
    userTwoId,
    twouser,
    taskOne,
    taskTwo,
    taskThree} = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')
require('dotenv').config({ path: './config/test.env' })
beforeEach(setupDataBase)
test('should create task for user', async () => {
     const res = await request(app)
     .post('/tasks')
     .set('authorization',`Bearer ${oneuser.tokens[0].token}`)
     .send({
         description:'from test'
     })
     .expect(201)
     const task = await Task.findById(res.body._id)
     expect(task).not.toBeNull()
     expect(task.completed).toEqual(false)
})
test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${oneuser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${twouser.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
