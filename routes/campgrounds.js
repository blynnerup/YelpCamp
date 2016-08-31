var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCamps});
        }
    });
    //res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground
           res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

// EDIT 
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    // is the user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/campgrounds");
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    res.render("campgrounds/edit", {campground: foundCampground});            
                } else {
                    res.send("You do not have permission to do that");
                }
            }
        });
    } else {
        res.send("You need to be logged in to do that");
    }
});
// UPDATE
router.put("/:id", checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/back");
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){ // cannot do === as it's an (mongoose) object compared to a string. .equals is a mongoose method that allows for checking if properties are equal.
                    next(); // if it's the owner, run the next part of the function   
                } else {
                    res.redirect("back"); // send them back to where they came!
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;