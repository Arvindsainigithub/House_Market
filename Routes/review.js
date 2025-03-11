const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require('../Utils/wrapAsync')
const List = require("../models/Listing")
const Review = require("../models/review")
const {reviewSchema }= require('../sheema')
const expressError = require("../Utils/ExpressError");

const validateReview= (req,res,next)=>{
  let {error}=reviewSchema.validate(req.body)
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new expressError(401,errMsg)
  }else{
    next();
  }
}

router.post("/",validateReview,wrapAsync( async(req,res)=>{
    let listing = await List.findById(req.params.id)
    console.log(listing)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    listing.save()
    newReview.save()
    res.redirect(`/listings/${listing.id}`)
  }))
  // delete review 
  router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await List.findByIdAndUpdate(id,{$pull :{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
      
  }))

  module.exports = router;