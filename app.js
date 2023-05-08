require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //for bcrypt

const app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);


app.get("/", async (req, res) => {
    res.render("home");
})

app.get("/login", async (req, res) => {
    res.render("login");
})

app.get("/register", async (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        const user = newUser.save();

        if (user) {
            res.render("secrets");
        }
    });



});

app.post("/login", async (req, res) => { 
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ email: username });

    if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
                res.render("secrets");
            }
        });
    }
});



app.listen(3000, function () {
    console.log('port 3000 started');
})
