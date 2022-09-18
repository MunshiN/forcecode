const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phno:{
        type:Number,
        required:true,
        minlength:10
    },
    password:{
        type:String,
        required:true
    },
},{timestamps:true})

const register = new mongoose.model("Users",registerSchema)

module.exports = register;
