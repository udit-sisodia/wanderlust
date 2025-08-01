const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index=async (req,res)=>{
//     const allListings=await Listing.find({});
//     // console.log(allListings);
//     res.render("listings/index.ejs",{allListings});
// }
module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, category });
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else{
         res.render("listings/show.ejs",{listing});
    }
     console.log(listing);

}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing=async (req,res)=>{
 let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()

    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
   newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save(); 
    console.log(savedListing);
    req.flash("success","New Listing Created"); 
    res.redirect("/listings");
        
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        let originalUrl=listing.image.url;
        const transformUrl=originalUrl.replace("/upload","/upload/w_250/")
        console.log(transformUrl)
        res.render("listings/edit.ejs",{listing,transformUrl});
    }
    
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(req.file){
    
    listing.image={
        url:req.file.path,
        filename:req.file.filename
    };
}
    await listing.save();

    req.flash("success","Listing Updated!"); 
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let currentListing= await Listing.findByIdAndDelete(id);
    console.log(currentListing);
    req.flash("success","Listing Deleted!"); 
    res.redirect("/listings");
}