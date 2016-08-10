var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

// Create the model object Cat, which creates the pluralized version of Cat as a collection in Mongo (cats). The Cat model object then have a lot of methods applied to it (mongo methods) like create, find and so on.
var Cat = mongoose.model("Cat", catSchema);

// adding a new cat to the DB

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

// Try to save George to the DB. Using a callback function in case the cat wasn't saved.
// Note that the cat in the callback is NOT the george cat in JS, but the cat returned from the DB!
// george.save(function(err, cat){
//     if(err){
//         console.log("SOMETHING WENT WRONG!");
//     } else {
//         console.log("We just saved a cat to the DB:")
//         console.log(cat);
//     }
// });

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

// retrieve all cats from the DB and console.log each one
Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR!");
        console.log(err);
    } else {
        console.log("All the cats....");
        console.log(cats);
    }
});