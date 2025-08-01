const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js");


//Review 
//post review route
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewControllers.createReview))

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewControllers.destroyReview)

module.exports=router;