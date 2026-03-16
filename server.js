const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

/* Middleware */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

/* MySQL Connection */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "gift_project"
});

db.connect(function(err){
    if(err){
        console.log("Database connection failed:", err);
    }
    else{
        console.log("Connected to MySQL Database");
    }
});


/* ================= SIGNUP ================= */

app.post("/signup",(req,res)=>{

console.log("Signup Form Data:", req.body);

const name = req.body.name;
const email = req.body.email;
const password = req.body.password;

const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

db.query(sql,[name,email,password],function(err,result){

if(err){
console.log("Signup DB Error:", err);
res.send("Signup Error - Check terminal");
}

else{
res.redirect("/login.html");
}

});

});


/* ================= LOGIN ================= */

app.post("/login",(req,res)=>{

const email = req.body.email;
const password = req.body.password;

const sql = "SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],function(err,result){

if(err){
console.log("Login DB Error:", err);
res.send("Login Error");
}

else if(result.length > 0){

res.redirect("/welcome.html?name=" + result[0].name);

}

else{

res.send("Invalid Email or Password");

}

});

});


/* ================= QUIZ RESULT ================= */

app.post("/quiz",(req,res)=>{

const receiver = req.body.receiver;
const type = req.body.type;

const sql = "SELECT DISTINCT * FROM gifts WHERE type=?";

db.query(sql,[type],function(err,result){

if(err){

console.log("Gift Query Error:", err);
res.send("Error fetching gifts");

}

else{

let output = `
<html>
<head>
<title>Gift Suggestions</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<h2 style="text-align:center">Gift Suggestions for ${receiver}</h2>

<div class="gift-container">
`;

result.forEach(gift => {

output += `
<div class="gift-card">

<img src="${gift.image}" alt="gift image">

<h3>${gift.gift_name}</h3>

<p class="price">₹${gift.price}</p>

<div class="gift-buttons">

<a href="${gift.buy_link}" target="_blank">
<button class="buy-btn">Buy Online</button>
</a>

<a href="https://www.google.com/maps/search/${gift.gift_name}+shop+near+me" target="_blank">
<button class="nearby-btn">Nearby Store</button>
</a>

</div>

</div>
`;

});

output += `
</div>

</body>
</html>
`;

res.send(output);

}

});

});


/* ================= START SERVER ================= */

app.listen(3000,function(){

console.log("Server running at: http://localhost:3000");

});