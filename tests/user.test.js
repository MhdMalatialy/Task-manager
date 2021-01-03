const request = require('supertest') 
const User = require('../src/models/user')
const app = require('../src/app')
const mongoose = require('mongoose')
const {userOneId,oneuser,setupDataBase} = require('./fixtures/db')
beforeEach(setupDataBase)
afterEach(() => {
    console.log('after each')
})
test ('should signup a new user', async () => {
    const res = await request(app).post('/users').send({
        name: 'mohammad',
        email:'mohammad1@example.com',
        password:'mhd123456!!'
    }).expect(201)
//..................
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
//...............
    expect(res.body).toMatchObject({
        user:{
            name:'mohammad',
            email:'mohammad1@example.com'
        },
        token:user.tokens[0].token
    })
    //..............
    expect(user.password).not.toBe('mhd123456!!')
    
})
test ('should login user',async () => {
   const res = await request(app).post('/users/login').send({
        password:oneuser.password,
        email:oneuser.email 
    }).expect(200)
    const user = await User.findById(res.body.user._id)
    expect(user.tokens[1].token).toBe(res.body.token)
    
})
test('should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
        email: oneuser.email,
        password:'dfjkfgshf'
    }).expect(401)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${oneuser.tokens[0].token}`)
        .send()
        .expect(200)
})
test('should  not get profile for unauthorization user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test ('should delete a user', async () => {
   const res = await request (app)
    .delete('/users/me')
    .set('authorization',`Bearer ${oneuser.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(res.body._id)
    expect(user).toBeNull()
})
test ('should not delete a unauthoruzation user', async () => {
    await request (app)
    .delete('/users/me')
    .send()
    .expect(401)
})
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('authorization',`Bearer ${oneuser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/Capture001.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('authorization', `Bearer ${oneuser.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(201)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${oneuser.tokens[0].token}`)
        .send({
            location: 'damas'
        })
        .expect(400)
})