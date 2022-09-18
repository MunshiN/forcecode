const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const registerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    categories:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    likes:{
        type:Number,
        default:0
    },
    likelist:[{
        type:ObjectId,
        ref:'user'
    }]
},{timestamps:true})

const register = new mongoose.model("blogs",registerSchema)

module.exports = register;
