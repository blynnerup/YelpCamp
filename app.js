var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    seedDb          = require("./seeds"); // Get the seed function from the seeds.js file - used for nuking (and reinitializeing the db with some data) the db for a clean start.

// Requring routes  
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcamp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Seed the database
// seedDb();

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

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // Another way of DRYing up routes. All the campground routes starts with /campground. That ("/campgorund") can be removed in the routes/campground.js file by adding this
app.use("/campgrounds/:id/comments", commentRoutes); 


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});