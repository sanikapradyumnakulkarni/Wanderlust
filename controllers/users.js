const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
let {username,email,password}=req.body;
const newUser=new User({email,username});
const registeredUser=await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{
   if(err)
   {
    return next(err);
   }
   req.flash("success","Welcome to Wanderlust!");
   res.redirect("/listings");

});//login method with callback similar to logout

    }
    catch(e){
        req.flash("error",e.message); //custom functionality
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async (req,res)=>{//passport.authenticate is  a middleware which is used in post request for authentication local-strategy
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}