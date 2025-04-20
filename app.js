const express=require("express");
const app=express();
const  mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const {reviewSchema}=require("./schema.js");
// const { listingSchema } = require("./schema.js");
const passport=require("passport");
const userRouter=require("./routes/user.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to DB");
})
.catch(err=>{
    console.log(err);
});

async function main()
{
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:"my",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

// app.get("/",(req,res)=>{
//   res.send("hello");
// });
app.use(session(sessionOptions));//session implemented
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//initialize passport for each request
//to recognize the user as same if the same request is sent on different browser
passport.use(new LocalStrategy(User.authenticate()));//login or signup the user

passport.serializeUser(User.serializeUser());//to serialize user info into the session
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  console.log("Current User:", req.user);
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


app.use((err,req,res,next)=>{
  let { statusCode=500, message="Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(404).send("Page not found!");
  // res.render("error.ejs",{err})
});



// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");

//     next();
// })

  //to remove user info from the session       
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.listen(8080,()=>{
  console.log("Server is listening on 8080");
});

// app.use("/listings",listingRouter);
// app.use("/listings/:id/reviews",reviewRouter);
// app.use("/",userRouter);
// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(",");
//     throw new ExpressError( 400,msg);
//   }
//     next();
  
 
// };
// const validateReview=(req,res,next)=>{
//   let {error}=reviewSchema.validate(req.body);
//   if(error)
//   {
//     const errMsg=error.details.map(el=>el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }
//   else{
//     next();
//   }
// }

//index routes
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   }));
  
//   //New Route
//   app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
//   });
  
//   //Show Route
//   app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
//   }));
  
//   //Create Route
//   app.post("/listings", wrapAsync(async (req, res,next) => {
    
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
    
//   }));
  
//   //Edit Route
//   app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
//   }));
  
//   //Update Route
//   app.put("/listings/:id",wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   }));
  
//   //Delete Route
//   app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   }));
  
  // app.get("/testListing", async (req, res) => {
  //   let sampleListing = new Listing({
  //     title: "My New Villa",
  //     description: "By the beach",
  //     price: 1200,
  //     location: "Calangute, Goa",
  //     country: "India",
  //   });
  
  //   await sampleListing.save();
  //   console.log("sample was saved");
  //   res.send("successful testing");
  // });
// app.post("/listings/:id/reviews" ,wrapAsync(async(req,res)=>{ ///listings/:id/reviews
//     let listing= await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();//save to db
//     console.log("New review saved");
//     res.redirect(`/listings/${listing._id}`);
//  }));

//  //delete review
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{  ///listings/:id/reviews/:reviewId
//   let {id,reviewId}=req.params;
//  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`);
//  })
// );


