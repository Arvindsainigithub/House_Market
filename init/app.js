const mongoose = require('mongoose')
const initData = require("./data")
const list = require('../models/Listing')
require('dotenv').config();
const Join = async()=>{
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("Database is connected")
}
Join();

const initDb =async ()=>{
    await list.deleteMany({})
    console.log("Data deleted")
    await list.insertMany(initData.data)
    console.log("Data initialized")
}
initDb();