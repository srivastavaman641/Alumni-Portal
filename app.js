var express                 = require('express');
var app                     = express();
var bodyParser              = require("body-parser");
var mongoose                = require("mongoose");
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var User                    = require("./models/user");
var Education               = require("./models/education");
var Work                    = require("./models/work");


mongoose.connect("mongodb://localhost/portal");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "The Key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


// Root route
app.get("/", function(req, res){
    res.render("landing");
});

// Members Area
app.get("/members", isLoggedIn,function(req, res){
    res.render("memarea");
});

//Show user data
app.get("/members/:id", isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("education").populate("work").exec(function(err, user){
        if(err){
            console.log(err);
        }else{
            console.log(user);
            res.render("userdata", {user: user});
        }
    });
});


//===========================
// EDUCATION ROUTES
//===========================

// Education new page
app.get("/members/:id/education/new", isLoggedIn, function(req, res){
    //find user by id
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }
        else{
           
            res.render("newedu", {user: user});
        }
    });
});

// Education create and add to user
app.post("/members/:id/education/", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/members");
        }
        else{
            Education.create(req.body.education, function(err, education){
                if(err){
                    console.log(err);
                }
                else{
                    // console.log(comment);
                    education.save();
                    // add username and id to comment
                    user.education.push(education._id);
                    user.save();
                    console.log(user);
                    res.redirect("/members/" + user._id);
                }
            });
        }
    });
});


//===========================
// WORKING ROUTES
//===========================

// Work new page
app.get("/members/:id/work/new", isLoggedIn, function(req, res){
    //find user by id
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        }
        else{
           
            res.render("newwork", {user: user});
        }
    });
});

// Work create and add to user
app.post("/members/:id/work/", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/members");
        }
        else{
            Work.create(req.body.work, function(err, work){
                if(err){
                    console.log(err);
                }
                else{
                    // console.log(comment);
                    work.save();
                    // add username and id to comment
                    user.work.push(work._id);
                    user.save();
                    console.log(user);
                    res.redirect("/members/" + user._id);
                }
            });
        }
    });
});



//===========================
//      AUTH ROUTES
//===========================

// show register form
app.get("/register", function(req, res){
    res.render("register");
});

// handle signup logic
app.post("/register", function(req, res){
    var newUser = new User(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            course: req.body.course,
            phone: req.body.phone,
            roll: req.body.roll,
            username: req.body.username,
        });
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log(user);
            res.redirect("/members");
        });
    });
});


// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/members",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.render("login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Portal Server Started!!!");
});