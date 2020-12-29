const express = require('express')
const router = new express.Router
const User=require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const sendMail = require('../email/nodemailer')
router.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAutoToken()
        user.tokens = user.tokens.concat({token})
        await user.save()
        res.status(201).send({user,token})
    }
    catch (e){
        res.status(401).send(e)
    }
})
// creat user
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try {
    const token = await user.generateAutoToken()
    user.tokens = user.tokens.concat({token})
    await user.save()
    sendMail(user.email ,user.name ,'welcome to my app','please verfiy your account')
    res.status(201).send({user,token})

    }
    catch(e) {
        res.status(400).send(e)
    }})
router.get('/users/me', auth,async(req,res)=> {

        res.status(201).send(req.user)
})
// 
router.post('/users/logout',auth, async (req,res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res .status(201).send()
    } catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutall',auth, async (req,res) =>{
    try {
        req.user.tokens = []
        await req.user.save()
        res .status(201).send()
    } catch(e){
        res.status(501).send()
    }
})
router.patch('/users/me',auth, async (req,res) => {
    const allowsUpdates = ['name','email','password','age']
    const updates = Object.keys(req.body)
    const isValid=updates.every((update) => {
        return allowsUpdates.includes(update)
    })
    if (!isValid) {
        return res.status(400).send('invaild update')
    }
    try{
    updates.forEach((update) => req.user[update]=req.body[update])
    
    await req.user.save()
       res.status(201).send(req.user)
    }
    catch(e){
       res.status(405).send(e) 
    }
})
router.delete('/users/me', auth, async ( req, res) => {
    try{
       await req.user.remove()
       sendMail(req.user.email ,req.user.name ,'Good bye😢','I hope to have you back soon')
        res.status(201).send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})
// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id
//     try{
//         const user =await User.findById(_id)
//         if (!user){
//             return res.status(404).send()
//         }
//         res.send(user).status(201)
//     }
//     catch(e){
//         res.send().status(500)
//     }
// })
const upload = multer({
    limits:{fileSize:1000000},
    fileFilter (req, file, cb){
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('that`s not image'))
        }
        cb(undefined,true)
    }
})
router.post ('/user/me/avatar', auth, upload.single('avatar'),  async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:300,height:300}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
res.status(200).send('..')
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
}) 
router.delete ('/user/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
res.status(200).send('..')
}) 
router.get('/user/:id/avatar',async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar){
            throw new Error('')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})
module.exports=router