var mongoose = require("mongoose");

//Schema Setup
var educationSchema = new mongoose.Schema({
    course: String, 
    university: String,
    yearofjoin: String,
    passyear: String
});

module.exports = mongoose.model("Education", educationSchema);