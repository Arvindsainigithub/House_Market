const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
      filename:String,
      url:String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }
]
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : { $in: listing.reviews}});
  }
  
})

const List = mongoose.model("List", listingSchema);
module.exports = List
