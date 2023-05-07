require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5=require("md5");

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
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    const user = await newUser.save();

    if (user) {
        res.render("secrets");
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    const foundUser = await User.findOne({ email: username });

    if (foundUser) {
        if (foundUser.password === password) {
            res.render("secrets");
        }
    } else {
        console.log("error");
    }
})



app.listen(3000, function () {
    console.log('port 3000 started');
})
