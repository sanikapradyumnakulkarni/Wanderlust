const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async(req,res)=>{ ///listings/:id/reviews
    // console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();//save to db
    // console.log("New review saved");
    req.flash("success","New review Created!");
    res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview=async(req,res)=>{  ///listings/:id/reviews/:reviewId
    let {id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
   };