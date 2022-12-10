// Importation des tous les composants//
const express = require("express");
const mysql = require("mysql");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path:'./.env'})
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const { encode } = require('punycode');
let encodeUrl = parseUrl.urlencoded({ extended: false });
//----------------------------------------------------------//
//session middleware
app.use(sessions({
    secret: "thisismysecretkey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));
app.use(cookieParser());

// Creer la connexion avec la base de données, les infos de connexion sont dans .env
const db = mysql.createConnection({
    host: process.env.DATABASE_Host,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port:'3306'
});

// To put files such as CSS and JavaScript to use
const publicDirectory = path.join(__dirname, './css');
//to get all the CSS files that have been created
app.use(express.static(publicDirectory));
console.log(__dirname);
app.use('/static', express.static('img'));
// connecting to hbs for HTML
app.set('view engine', 'hbs');

//Montre dans le terminal que la base de données est bien connectée
db.connect( (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("The database is well connected !")
    }})


// Démarre les pages du serveur
app.get("/",(req,res) => {
    res.render("home");
});
app.get("/shop-grid",(req,res) => {
    res.render("shop-grid");
});
app.get("/contact",(req,res) => {
    res.render("contact");
});
app.get("/checkout",(req,res) => {
    res.render("checkout");
});
app.get("/like",(req,res) => {
    res.render("like");
});
app.get("/shoping-cart",(req,res) => {
    res.render("shoping-cart");
});

//listening to the port
app.listen(3000,() =>{
    console.log("The server started on port 3000 !");
})
