const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers=require("../controllers/users.js");

router.get("/signup",(userControllers.renderSignupForm));

router.post("/signup",wrapAsync(userControllers.signup))

router.get("/login",userControllers.renderLoginForm)

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: '/login',failureFlash:true}),
    userControllers.login)


router.get("/listings/logout",userControllers.listingLogout)

router.get("/logout",userControllers.logout)

module.exports=router;