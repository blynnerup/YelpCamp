var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
            {name: "Salmon Creek", image: "https://farm7.staticflickr.com/6184/6098814500_c5aac9703c.jpg"},
            {name: "Granite Hill", image: "https://farm9.staticflickr.com/8486/8240036928_1a31fbbe9e.jpg"},
            {name: "Moutain Goats Rest", image: "https://farm9.staticflickr.com/8314/7968774876_11eafbfbb7.jpg"},
        ];   

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});