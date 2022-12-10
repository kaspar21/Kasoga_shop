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
app.get("/aboutus",(req,res) => {
    res.render("aboutus");
});
app.get("/gallery",(req,res) => {
    res.render("gallery");
});
app.get("/booking",(req,res) => {
    res.render("booking");
});
app.get("/services",(req,res) => {
    res.render("services");
});
app.get("/login",(req,res) => {
    res.render("login");
});
app.get("/register",(req,res) => {
    res.render("register");
});
app.get("/aboutuslog",(req,res) => {
    res.render("aboutuslog");
});
app.get("/bookinglog",(req,res) => {
    res.render("bookinglog");
});
app.get("/gallerylog",(req,res) => {
    res.render("gallerylog");
});
app.get("/homelog",(req,res) => {
    res.render("homelog");
});
app.get("/serviceslog",(req,res) => {
    res.render("serviceslog");
});


//----------------------------------------------------------------------------//
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

//----------------------------------------------------------------------------//
//js pour login
app.post("/login", encodeUrl, (req, res)=>{
    var mail = req.body.mail;
    var password = req.body.password;
    db.connect(function(err) {
        if(err){
            console.log(err);
        };
//get user data from MySQL database
        db.query(`SELECT * FROM db_client WHERE mail = '${mail}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };
// creating userPage function to create user page
          function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
                firstName: result[0].firstName, // get MySQL row data
                lastName: result[0].lastName, // get MySQL row dataa
                mail: mail,
                password: password 
            };
            res.render("bookinglog");
        }

        if(Object.keys(result).length > 0){
            userPage();}
            else{
                res.render("login");
            }
        });
    });
});

//----------------------------------------------------------------------------//
//javascript pour le booking 
app.post('/booking', encodeUrl, (req, res) => {
    var date_arv = req.body.date_arv;
    var date_dprt = req.body.date_dprt;
    var nb_adlts = req.body.nb_adlts;
    var nb_child = req.body.nb_child;
    var idclient = 32   ;   

    db.connect(function(err) {
        var sql = `INSERT INTO db_hotel (idclient, date_arv, date_dprt, nb_adlts, nb_child) VALUES ('${idclient}', '${date_arv}', '${date_dprt}', '${nb_adlts}', '${nb_child}')`;
                db.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        
                        db.query(`SELECT * FROM db_hotel WHERE idclient = '${idclient}'`, function (err, result) {
                            if(err){
                              console.log(err);
                            };
                  // creating userPage function to create user page
                            function userPage(){
                              // We create a session for the dashboard (user page) page and save the user data to this session:
                              req.session.user = {
                                date_arv: result[0].date_arv, // get MySQL row data
                                date_dprt: result[0].date_dprt, // get MySQL row dataa
                                nb_adlts: nb_adlts,
                                nb_child: nb_child 
                              };
                          }
                  
                          if(Object.keys(result).length > 0){
                              userPage();
                              res.send(`<!DOCTYPE html>
                              <head>
                              <title>Kasoga Hotel | Booked  </title>
                              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                              <meta name="viewport" contentb="width=device-width, initial-scale=1.0">
                              <link rel="icon" type="image/x-icon" href="images/hotel.ico">
                              <link  href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"rel="stylesheet">
                              <script type="text/javascript" src="../app.js"></script>
                              
                              <link href="style.css" rel="stylesheet" type="text/css" />
                              <link href="layout.css" rel="stylesheet" type="text/css" />
                              </head>
                              
                              <body>
                                  <div id="myNav" class="topnav">
                                  <div class="menu_sid-content">
                                      <a href="/homelog">Home</a>
                                      <a href="/serviceslog">Services</a>
                                      <a href="/gallerylog">Gallery</a>
                                      <a href="/aboutuslog">About us</a>
                                      <a href="/">Logout</a>
                                  </div>
                               </div>


                               <br><br><br><br><br><br><br><br>
                               <h8>It's good you have booked the Premium room !</h8><br><br><br><br>
                               <h9> We will be delighted to welcome you from ${date_arv} to ${date_dprt} ;-)</h9>  <br><br><br><br>
                               <h11>You will be ${nb_adlts} adults and ${nb_child} children. Have a great stay at Kasoga Hotel ★★★★★</h11>
                               <br><br><br><br> <br><br><br><br>
                               <h12> <a href="/">Click here</a> to disconnect from KASOGA HOTEL FIVE STARS</h12>
                               <br><br><br>
                               <h13>Want to know more about our community? <a href="/aboutuslog">Click here </a>  :-)</h13></a>
                               <br><br><br><br><br><br><br><br>
                               

                              
                              </body>
                              <div class="footer-basic">
                                <footer>
                                  <div class="social"><a href="https://www.instagram.com/" target="_blank"><i class="icon ion-social-instagram"></i></a><a href="https://www.snapchat.com/fr-FR" target="_blank"><i class="icon ion-social-snapchat"></i></a><a href="https://twitter.com/" target="_blank"><i class="icon ion-social-twitter"></i></a><a href="https://facebook.com" target="_blank"><i class="icon ion-social-facebook"></i></a></div>
                                  <ul class="list-inline" >
                                      <li class="list-inline-item"><a href="/homelog">Home</a></li>
                                      <li class="list-inline-item"><a href="/serviceslog">Services</a></li>
                                      <li class="list-inline-item"><a href="/gallerylog">Gallery</a></li>
                                      <li class="list-inline-item"><a href="/aboutuslog">About Us</a></li>
                                  </ul>
                                  
                                    <p class="copyright">KASOGA © 2022</p>
                                  
                                </footer>
                              </div>
                              
                              <style>
                                * { margin:0; padding:0;}
                              html, body { height:100%;}
                              body { background:url(images/body-bg.gif) center top #37271c; font-family:Tahoma, Geneva, sans-serif; font-size:100%; line-height:1.125em; color:#bca695;}
                              
                              input, select, textarea { font-family:Tahoma, Geneva, sans-serif; font-size:1em;}
                              
                              .fleft { float:left;}
                              .fright { float:right;}
                              .clear { clear:both;}
                              
                              .alignright { text-align:right;}
                              .aligncenter { text-align:center;}
                              
                              .wrapper { width:100%; overflow:hidden;}
                              .container { width:100%;}
                              .sofiane { width:100%; overflow:hidden;text-align: center;margin-left: 14%;}
                              #dessus{
                                width: 132px;
                                height: 82px;
                              }
                              
                              
                              
                              p { margin-bottom:18px;}
                              
                              /*==================forms====================*/
                              input, select { vertical-align:middle; font-weight:normal;}
                              object { vertical-align:top; outline:none;}
                              
                              
                              /*==================list====================*/
                              ul { list-style:none;}
                              
                              /*==================other====================*/
                              .img-indent { margin:0 10px 0 -8px; float:left;}
                              .img-indent.alt { margin-right:25px;}
                              .img-box { width:100%; overflow:hidden; padding-bottom:20px;}
                              .img-box img { float:left; margin:0 20px 0 0;}
                              .monimage{float:left; background:url(images/nous.jpg); width: 250px; height: 500px;}
                              
                              .extra-wrap { overflow:hidden; }
                              
                              .p1 { margin-bottom:9px;}
                              .p2 { margin-bottom:18px;}
                              .p3 { margin-bottom:27px;}
                              
                              .alt-top { padding-top:9px;}
                              
                              /*==================txt, links, lines, titles====================*/
                              a {color:#bca695; outline:none;}
                              a:hover{text-decoration:none;}

                              h1 { font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; font-size:60px; line-height:1em; color:#c30000; text-transform:uppercase; font-weight:normal; letter-spacing:-2px;}
                              h1 a { color:#c30000; text-decoration:none;}
                              h2 { font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#c30000; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:12px; letter-spacing:-1px;}
                                    h3 { font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#c30000; font-size:25px; line-height:1em; font-weight:normal; margin-bottom:16px;}
                                    h4 { font-size:.91em;}
                                    h5 { font-size:1.33em; color:#c30000; padding-top:10px; margin-bottom:26px;}
                                    h6 { font-size:1em; color:#e7e7e7;}
                                    h7 { font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#3a1600; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:12px; letter-spacing:-1px;}
                                    h8{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic;margin-left: 31%;}
                                    h9{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic;margin-left: 17%}
                                    h10{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic;margin-left: 20%;}
                                    h11{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:30px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic; margin-left: 17%;}
                                    h12{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:25px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic;margin-left: 29%;}
                                    h13{ font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; color:#ffffff; font-size:25px; line-height:1em; font-weight:normal; margin-bottom:20px; letter-spacing:-1px;font-style: italic;margin-left: 29%;}


                              .txt1 { font-size:.91em;}
                              .txt2 { color:#c30000; font-size:1.33em; text-transform:uppercase;}
                              
                              .link1 { display:block; float:left; background:url(images/link1-bgd.gif) left top repeat-x; color:#fff; text-decoration:none;}
                              .link1 em { display:block; background:url(images/link1-left.gif) no-repeat left top;}
                              .link1 b { display:block; background:url(images/link1-right.gif) no-repeat right top; padding:2px 15px 2px 15px; font-weight:normal; font-style:normal;}
                              .link1:hover { text-decoration:underline;}
                              
                              .button { text-align:center; font-size:.91em;}
                              .button span { display:inline-block; background:url(images/button-side.gif) no-repeat left top; padding-left:1px;}
                              .button span span { background:url(images/button-side.gif) no-repeat right top; padding-right:1px; padding-left:0;}
                              .button span span a { display:inline-block; background:url(images/button-bg.gif) left top repeat-x; padding:0 0 3px 0; color:#d5c6bb; width:152px; text-decoration:none; text-transform:uppercase; font-weight:bold;}
                              .button span span a:hover { text-decoration:underline;}
                              
                              .button1 { text-align:center; font-size:.91em;}
                              .button1 span { display:inline-block; background:url(images/button-side.gif) no-repeat left top; padding-left:1px;}
                              .button1 span span { background:url(images/button-side.gif) no-repeat right top; padding-right:1px; padding-left:0;}
                              .button1 span span a { display:inline-block; background:url(images/button-bg.gif) left top repeat-x; padding:0 20px 3px 20px; color:#d5c6bb; text-decoration:none; text-transform:uppercase; font-weight:bold;}
                              .button1 span span a:hover { text-decoration:underline;}
                              
                              .line-hor { background:#4d3525; height:1px; overflow:hidden; font-size:0; line-height:0; margin:21px 0 16px 0;}
                              .line-ver { background-image:url(images/line-ver.gif); background-repeat:repeat-y; width:100%;}
                              
                              .title { margin-bottom:20px;}
                              
                              /*==================boxes====================*/
                              .box { background:#1d110b; width:100%;}
                              .box .inner { padding:21px 30px 30px 28px;}
                              
                              .dept-list { float:left;}
                              .dept-list dd { clear:both; text-align:right;}
                              .dept-list dd span { float:left; padding-right:25px;}
                              .dept-list dd p { text-align:left;}
                              
                              
                              /*header*/
                              #header .row-1 { height: 100px; }
                              #header .row-2 { height:390px; background:url(images/header-bg.png) no-repeat left bottom;}
                              #header .row-2.alt { height:278px; background:url(images/header-bg1.png) no-repeat left bottom; width:100%; padding:0; margin:0;}
                              #header .row-2 .indent { padding:13px 0 0 13px;}
                              
                              #header .logo { float:left; padding:40px 0 0 45px;}
                              #header .logo em { position:absolute; top:25px; text-transform:uppercase; font-style:normal; font-size:16px; font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; font-weight:bold; padding-left:5px;}
                              #header .logo strong { color:#ad0000; font-size:.91em; padding-left:5px;}
                              
                              .header-box { background:url(images/header-bg1.jpg) no-repeat left top; width:950px; height:364px;}
                              .header-box .inner { padding:307px 0 0 2px;}
                              
                              .header-box-small { background:url(images/header-bg-small.jpg) no-repeat left top; width:950px; height:252px; }
                              .header-box-small .inner { padding:195px 0 0 2px;}
                              
                              #header .nav { width:100%; overflow:hidden;}
                              #header .nav li { display:inline;}
                              #header .nav li a { display:block; float:left; width:156px; height:55px; line-height:52px; font-size:16px; text-transform:uppercase; font-weight:bold; color:#fff; text-decoration:none; font-family:"Trebuchet MS", Arial, Helvetica, sans-serif; text-align:center; margin-right:2px; background:url(images/nav-bg1.png) no-repeat left top;}
                              #header .nav li a:hover { background:url(images/nav-bg2.png) no-repeat left top;}
                              #header .nav li a.current { background:url(images/nav-bg2.png) no-repeat left top;}
                              
                              /*content*/
                              #content { background:url(images/content-bg.png) left top; margin:0 8px;  padding:11px 40px 20px 40px;}
                              #content .indent { padding:17px 0 20px 0;}
                              
                              #content ul { padding-bottom:20px;}
                              #content ul li { background:url(images/bull1.gif) no-repeat left 8px; padding:0 0 0 13px;}
                              
                              #content .gallery { width:100%; }
                              #content .gallery ul { overflow:hidden; margin:-7px -40px -11px -32px; position:relative;}
                              #content .gallery ul li { background:url(images/img-wrapper.png) no-repeat left top; width:155px; height:110px; padding:0; float:left; margin-right:3px;}
                              #content .gallery ul li img {margin:13px 0 0 11px;}
                              
                              #content .gallery-images { width:100%;}
                              #content .gallery-images ul {overflow:hidden; margin:0 -32px -14px 0; position:relative; padding-bottom:0;}
                              #content .gallery-images ul li { float:left; padding:0 0 14px 0; background:none; margin-right:16px;}
                              
                              #content .img-list li { width:100%; overflow:hidden; background:none; padding:0 0 18px 0;}
                              #content .img-list li img { float:left; margin:6px 9px 0 0;}
                              
                              .extra-img { position:relative; margin:0 -9px 0 -8px;}
                              
                              .gallery-main { background:url(images/gallery-wrapper.png) no-repeat left top; width:607px; height:433px; margin:0 -10px 0 -6px; position:relative;}
                              .gallery-main .inner { padding:12px 0 0 12px;}
                              .gallery-main .prev { position:absolute; left:11px; top:12px;}
                              .gallery-main .next { position:absolute; right:11px; top:12px;}
                              
                              .list1 { font-size:.91em; padding:4px 0 15px 0;}
                              .list1 dt { font-weight:bold; color:#e3dad2; margin-bottom:12px; padding:0 0 0 4px;}
                              .list1 dd { border-bottom:1px solid #57473c; padding:0 5px 7px 4px; margin-bottom:4px; line-height:1.45em;}
                              .list1 dd span { float:right;}
                              .list1 dd.alt { border-bottom:none;}
                              .list1 dd.last { font-weight:bold; color:#c30000; border-bottom:none;}
                              
                              #content .list2 { padding-bottom:8px;}
                              #content .list2 li { font-size:.91em; padding-bottom:8px;}
                              
                              #content .list3 li a { text-decoration:none;}
                              #content .list3 li a:hover { text-decoration:underline;}
                              
                              #content .list4 li { width:100%; overflow:hidden; padding:0; background:none; font-size:.91em; padding-bottom:15px;}
                              #content .list4 li img { float:left; margin:0 13px 0 0;}
                              
                              #content .aside ul { font-size:.91em;}
                              
                              /*footer*/
                              #footer { font-family:Arial, Helvetica, sans-serif; padding:28px 40px 35px 40px;}
                              #footer a { color:#e3dad2;}
                              #footer .nav { text-align:center; padding-bottom:25px;}
                              #footer .nav li { display:inline;}
                              #footer .nav li a { padding:0 48px 0 45px; color:#e3dad2;}
                              
                              .footer-basic {
                                  padding:40px 0;
                                  
                                  color:#4b4c4d;
                                }
                                
                                .footer-basic ul {
                                  padding:0;
                                  list-style:none;
                                  text-align:center;
                                  font-size:18px;
                                  line-height:1.6;
                                  margin-bottom:0;
                                  background-color: antiquewhite;
                                }
                                
                                .footer-basic li {
                                  padding:0 10px;
                                }
                                
                                .footer-basic ul a {
                                  color:inherit;
                                  text-decoration:none;
                                  opacity:0.8;
                                }
                                
                                .footer-basic ul a:hover {
                                  opacity:1;
                                }
                                
                                .footer-basic .social {
                                  text-align:center;
                                  padding-bottom:25px;
                                
                                }
                                
                                .footer-basic .social > a {
                                  font-size:24px;
                                  width:40px;
                                  height:40px;
                                  line-height:40px;
                                  display:inline-block;
                                  text-align:center;
                                  border-radius:50%;
                                  border:1px solid #ccc;
                                  margin:0 8px;
                                  color:inherit;
                                  opacity:0.75;
                                }
                                
                                .footer-basic .social > a:hover {
                                  opacity:0.9;
                                }
                                
                                .footer-basic .copyright {
                                  margin-top:15px;
                                  text-align:center;
                                  font-size:13px;
                                  color:#aaa;
                                  margin-bottom:0;
                                }
                              
                              /*==========================================*/
                              /*Barre de navigation haut de page*/
                              
                              /* Add a black background color to the top navigation */
                              .topnav {
                                background-color: #3a1600;
                                overflow: hidden;
                                }
                              
                                /* Style the links inside the navigation bar */
                                .topnav a {
                                float: left;
                                color: #f2f2f2;
                                text-align: center;
                                padding: 14px 16px;
                                text-decoration: none;
                                font-size: 17px;
                                }
                              
                                /* Change the color of links on hover */
                                .topnav a:hover {
                                background-color: #ddd;
                                color: black;
                                }
                              
                                /* Add a color to the active/current link */
                                .topnav a.active {
                                background-color: #04AA6D;
                                color: white;
                                }
                              
                              </style>`);
                            }
                              else{
                                  res.render("bookinglog");
                              }
                          });
                       
                        
                        
                    };});});});


//listening to the port
app.listen(3000,() =>{
    console.log("The server started on port 3000 !");
})
