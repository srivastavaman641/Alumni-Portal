var mongoose = require("mongoose");

//Schema Setup
var workSchema = new mongoose.Schema({
    company: String, 
    role: String,
    joinyear: String,
    leaveyear: String
});

module.exports = mongoose.model("Work", workSchema);