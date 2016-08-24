var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    Campground      = require("./models/campground"), // this returns the campground model (mongoose model)
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDb          = require("./seeds"); // Get the seed function from the seeds.js file - used for nuking (and reinitializeing the db with some data) the db for a clean start.

mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDb();

// Passport config
app.use(require("express-session")({
    secret: "Bears, tigers and lions ",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Handle passing the currentUser round to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", {campgrounds: allCamps});
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
    });
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

// ** Comments routes **
// New comment
app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn,function(req, res){
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
    // create new comment
    // connect new comment to campground
    // redirect campground show page
});

// ** Auth Routes **

// show reg. form
app.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
        // not really needed... - demonstrates middleware idea though :)
});

// logout route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});