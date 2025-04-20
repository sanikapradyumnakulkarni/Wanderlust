const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const passport=require("passport");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//       const msg = error.details.map(el => el.message).join(",");
//       throw new ExpressError( 400,msg);
//     }else{
//         next();
//     }  
//   };
//index and create 
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,
  wrapAsync(listingController.createListing));
//new
  router.get("/new",isLoggedIn,listingController.renderNewForm );

  //update,delete,show
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
//edit 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// index routes
// router.get("/", wrapAsync(listingController.index));
  
  //New Route
  // router.get("/new",isLoggedIn,listingController.renderNewForm );
  
  //Show Route
  // router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
  // router.post("/",isLoggedIn, wrapAsync(listingController.createListing));
  
  //Edit Route
//  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  
  //Update Route
//  router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing));
  
  //Delete Route
  // router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

  module.exports=router;