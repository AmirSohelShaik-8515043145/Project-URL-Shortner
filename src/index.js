const express =require('express')
const mongoose =require('mongoose')
const multer = require('multer')
const route = require('./route/route')

const app=express()

app.use(multer().any())

mongoose.connect("         ",{
    useNewUrlParser:true
}).then(()=>console.log("Database Connected")).catch(err=>console.log(err))

app.use('/',route)

app.listen(process.env.PORT||3000,function(){
    console.log("Server running on port 3000")
})
