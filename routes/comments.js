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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save()
                    campgorund.comments.push(comment);
                    campgorund.save();
                    res.redirect('/campgrounds/' + campgorund._id);
                }
            });
        }
    });
});

// Comments edit route
router.get("/:comment_id/edit", checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });      
        }
    });
});

// Comments update route
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// Comments destroy route -- REMEMBER THAT THE DESTROY BUTTON IN THE HTML NEEDS TO BE A FORM AS A HREF ONLY MAKES A GET REQUEST!!!
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Check ownership of comment
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("/back");
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
}

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;