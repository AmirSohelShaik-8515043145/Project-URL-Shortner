const express =require('express')
const bodyParser = require('body-parser');
const mongoose =require('mongoose')
const multer = require('multer')
const route = require('./route/route')
const app=express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect("mongodb+srv://amir-thorium:NSE7ZdUlu4no9WRF@cluster0.gchuo.mongodb.net/group58-DataBase?authSource=admin&replicaSet=atlas-cw2o95-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",{
    useNewUrlParser:true
}).then(()=>console.log("Database Connected")).catch(err=>console.log(err))

app.use('/',route)

app.listen(process.env.PORT||3000,function(){
    console.log("Server running on port 3000")
})
