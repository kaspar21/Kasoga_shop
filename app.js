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


//Montre dans le terminal que la base de données est bien connectée
db.connect( (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("The database is well connected !")
    }})

app.use('/img', express.static('img'));
app.use('/js', express.static('js'));
app.use(express.static(path.join(__dirname, './css')))

// Démarre les pages du serveur
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});
app.get("/shop-grid",(req,res) => {
    res.sendFile(path.join(__dirname, '/shop-grid.html'));
});
app.get("/shoping-cart",(req,res) => {
    res.sendFile(path.join(__dirname, '/shoping-cart.html'));
});
app.get("/contact",(req,res) => {
    res.sendFile(path.join(__dirname, '/contact.html'));
});
app.get("/checkout",(req,res) => {
    res.sendFile(path.join(__dirname, '/checkout.html'));
});


//-----------------------------------------------------------------------------//
//javascript pour insérer dans le panier
function insert_cart(idproduct, units){
    var sql = `INSERT INTO shopping_cart (idproduct, units) VALUES ('${idproduct}', '${units}')`;
    db.query(sql, function (err, result) {
        if (err){
            dbsole.log(err);
        }});
    };


//-----------------------------------------------------------------------------//
//javascript pour le register 
app.post('/register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var mail = req.body.mail;

    db.connect(function(err) {
        // checking user already registered or no
        db.query(`SELECT * FROM db_client WHERE mail = '${mail}' AND password  = '${password}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                //Affiche la page login si le mail est déjà dans la database
                res.render("login");
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    //db       nom variable
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    mail: mail 
                };
                res.render("login");
            }
                // inserting new user data
                var sql = `INSERT INTO db_client (firstName, lastName, password, mail) VALUES ('${firstName}', '${lastName}', '${password}', '${mail}')`;
                db.query(sql, function (err, result) {
                    if (err){
                        dbsole.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };});}});});});



//-----------------------------------------------------------------------------//
function sommedb(){
    var sql = 'SELECT units FROM kasoga_shop.shopping_cart';
    db.query(sql, function (err, result) {
        if (err){
            dbsole.log(err);
        }});
        
    };





//listening to the port
port = 1234;
app.listen(port,() =>{
    console.log('Server started at http://localhost:' + port);
})
