const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


//index route
router.get("/", wrapAsync(listingControllers.index));

//new route
console.log("typeof showListing:", typeof listingControllers.showListing); // should be 'function'
console.log("typeof wrapAsync:", typeof wrapAsync); // should be 'function'
router.get("/new",isLoggedIn,listingControllers.renderNewForm);



//show route
router.get("/:id",wrapAsync(listingControllers.showListing))



//create route
 router .post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.createListing))


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm))

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.updateListing))

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing))


module.exports=router;