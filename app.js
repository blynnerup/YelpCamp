var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"), // this returns the campground model (mongoose model)
    //Comment     = require("./models/comment"),
    //User        = require("./models/user"),
    seedDb       = require("./seeds"); // Get the seed function from the seeds.js file - used for nuking (and reinitializeing the db with some data) the db for a clean start.

seedDb();
mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from the DB
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCamps});
        }
    });
    //res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            console.log(foundCamp);
            // render show template with that campground
           res.render("show", {campground: foundCamp});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});