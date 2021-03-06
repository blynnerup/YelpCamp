var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    seedDb          = require("./seeds"); // Get the seed function from the seeds.js file - used for nuking (and reinitializeing the db with some data) the db for a clean start.

// Requring routes  
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp"; // Use the first database - if no - use the second
console.log(process.env.DATABASEURL); // In order for this to work you need to do (commandline): export DATABASEURL = mongodb://localhost/yelpcamp (this is how you create environment variables).

//mongoose.connect("mongodb://localhost/yelpcamp");
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // Another way of DRYing up routes. All the campground routes starts with /campground. That ("/campgorund") can be removed in the routes/campground.js file by adding this
app.use("/campgrounds/:id/comments", commentRoutes); 


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});