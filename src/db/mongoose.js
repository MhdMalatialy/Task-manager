const mongoose =require('mongoose');
const validator=require('validator');

mongoose.connect(process.env.MONGOOSEURL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
useFindAndModify:false });