const mongoose = require("mongoose");

const mongoConnection =()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/relation")
    .then(console.log("Connected database"))
    .catch(err =>{console.log("Coudnot connect",err)})
}
mongoConnection();

const userShchema = new mongoose.Schema({
    userName:String,
    location:[{
        _id:false,
        country:String,
        state:String,
    }]
})
const User = mongoose.model("User",userShchema)

const addUser = async()=>{ 
   let user1=new User({
    userName:"Arvind saini",
    location:[{
        country:"India",
        state:"Up"
    }]
})
user1.location.push({country:"Japan",state:"Hongkong"})
const result = await user1.save();
console.log(result);
}
addUser();
