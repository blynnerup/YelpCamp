var Campground = require("../models/campground"); // get the Mongo model for the campgrounds
var Comment = require("../models/comment") // get the Mongo model for the comments
// All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
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
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)){ // cannot do === as it's an (mongoose) object compared to a string. .equals is a mongoose method that allows for checking if properties are equal.
                    next(); // if it's the owner, run the next part of the function   
                } else {
                    res.redirect("back"); // send them back to where they came!
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;