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
app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});

//listening to the port
port = 8000;
app.listen(port,() =>{
    console.log('Server started at http://localhost:' + port);
})
