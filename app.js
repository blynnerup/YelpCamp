var express = require("express");
var app = express();

app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
            {name: "Salmon Creek", image: "https://farm7.staticflickr.com/6184/6098814500_c5aac9703c.jpg"},
            {name: "Granite Hill", image: "https://farm9.staticflickr.com/8486/8240036928_1a31fbbe9e.jpg"},
            {name: "Moutain Goats Rest", image: "https://farm9.staticflickr.com/8314/7968774876_11eafbfbb7.jpg"}
        ];    
        
        res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp server has started!"); 
});