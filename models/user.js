var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    roll: String,
    course: String,
    username: String,
    password: String,
    education: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education"
        }
    ],
    work: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Work"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);