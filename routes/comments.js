var express = require("express");
var router = express.Router({mergeParams: true}); // merges the params from comments and campgrounds together - otherwise the add new comment will not work
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// New comment
router.get("/new", isLoggedIn,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Create comment
router.post("/", isLoggedIn,function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campgorund){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campgorund.comments.push(comment);
                    campgorund.save();
                    res.redirect('/campgrounds/' + campgorund._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;