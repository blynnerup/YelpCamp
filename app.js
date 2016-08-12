var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");


mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//     name: "Granite Hill", 
//     image: "https://farm9.staticflickr.com/8486/8240036928_1a31fbbe9e.jpg",
//     description: "This is a huge granite hill, no bathrooms, no water. Beautiful granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground:");
//             console.log(campground);
//         }
//     });


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
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground
           res.render("show", {campground: foundCamp});
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});