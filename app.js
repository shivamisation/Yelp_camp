var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
// var commentRoutes = require("./routes/comments")
seedDb = require("./seeds");

mongoose.connect("mongodb://localhost/Yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

seedDb();

//Passport Config =================
app.use(
  require("express-session")({
    secret: "I will see Krishna and also talk with him one day",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req , res, next){
    res.locals.currentUser = req.user ; 
    next()
})

//======================================================

app.get("/", function (req, res) {
  res.render("campground/landing");
});

app.get("/campgrounds", isLoggedIn ,function (req, res) {
  //we need to get all the campgrounds from the database
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log("something went wrong");
    } else {
      res.render("campground/campgrounds", { campgrounds: allcampgrounds  , currentUser: req.user});
    }
  });
  // res.render("campgrounds" , {campgrounds : campgrounds })
});

app.post("/campgrounds" , isLoggedIn,function (req, res) {
  //get data from form and all the data to the array
  var name = req.body.name;
  var image = req.body.image;

  var newcmpgrnd = { name: name, image: image };

  Campground.create(newcmpgrnd, function (err, newlycreated) { 
    if (err) {
      console.log(err);
    } else {
      console.log("done successfully");
      console.log(newlycreated);
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function (req, res) {
  res.render("campground/new");
});

app.get("/campgrounds/:id", function (req, res) {
  // res.send("u are in  the show page")
  Campground.findById(req.params.id)
    .populate("comment")
    .exec(function (err, foundcmpgrnd) {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        console.log(foundcmpgrnd);
        res.render("campground/show", { campground: foundcmpgrnd });
      }
    });
});

//---------------------------------------//
//comments routes
//---------------------------------------//

app.get("/campgrounds/:id/comments/new", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      console.log("I just console.loggged the comment");

      console.log(req.body.comment);

      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          Campground.findById(req.params.id, function (err, campground) {
            if (err) {
              console.log(err);
            } else {
              campground.comment.push(comment);
              campground.save();
              res.redirect("/campgrounds/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

//Auth routes ======================

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, function () {
      // alert("signed up ")
      res.redirect("/campgrounds");
    });
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {
    // res.send("the login logic happens here")
  }
);

app.get("/logout" , function(req, res){
    req.logout() ;
    res.redirect("/campgrounds")
})

//===================================

function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect("/login")
    }
}

app.listen(3000, function () {
  console.log("The yelp camp server has started bruh....");
});
