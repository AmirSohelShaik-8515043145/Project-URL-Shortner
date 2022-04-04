const mongoose= require('mongoose')
const shortid=require('short-id')

const urlSchema=new mongoose.Schema({
    urlCode: { 
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    longUrl: {
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    }
})

module.exports=mongoose.model("url",urlSchema)