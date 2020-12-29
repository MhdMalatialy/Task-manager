const mongoose =require('mongoose');
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    password:{type:String,
            required:true,
            trim:true,
            minlength:7,
            validate (value){if(value.toLowerCase().includes('password'))
            throw new Error('invaild password')
            }},
    age:{
        type:Number,
    validate (value){
        if (value<0)
            throw new Error('age should be postive')
    },
    default:0},
    email:{
        unique:true,
        type :'string',
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))              
            throw new Error ('that no email')
        }
    },
    tokens : [{
        token:{
            type : String,
            required:true
         }

    }],
    avatar:{
        type : Buffer
    }
},{
    timestamps:true
} )
userschema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userschema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar
    return userObject
}
 userschema.methods.generateAutoToken = async function () {
            const user = this 
            const token = jwt.sign({_id:user._id.toString()},process.env.JWTSECRET)
            return token
        }
        userschema.statics.findByCredentials = async (email,password) => {
            const user = await User.findOne({email})
            if(!user) {
                    throw new Error ('unable to login')
                }
            
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) {
                throw new Error('Unable to login')
            }
            return user
        }
//hash password befor save
userschema.pre('save',async function(next){
    const user = this
     if( user.isModified('password'))(
         user.password=await bcrypt.hash(user.password,8)

     )
   next()
})
//remove tasks of deleted account
userschema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})

   next()
})
const User =mongoose.model('User',userschema )
 module.exports=User