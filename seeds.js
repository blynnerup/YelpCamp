// Seed the database - fresh start, all is removed and then some base data added.
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name : "Cloud's Rest", 
        image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
        description: "blah blah blah"
    },
    {
        name : "Forest Retreat", 
        image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg",
        description: "blah blah blah"
    },
    {
        name : "Horn Peak", 
        image: "https://farm9.staticflickr.com/8041/7930230882_0bb80ca452.jpg",
        description: "blah blah blah"
    }
];

// Clear out the database
function seedDb() {
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a campground");
                    // create a comment
                    Comment.create(
                        {
                            text: "This place is great, but no internet :(",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err)
                            } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment");
                            }
                        });
                }
            });
        });
    });
    
    // add a few comments
}

// Return the seedDb function - this will be stored in what ever variable that requires it.
module.exports = seedDb;