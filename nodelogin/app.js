 const bodyparser = require("body-parser");
 const express = require("express");
 const bcrypt = require('bcrypt');
 const path=require('path');
 const mysql=require('mysql');

 const app=express();
 const saltRounds=10;

 // ===== SET TEMPLATE ENGINE ========
app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));
app.use("/views",express.static("views"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
extended:true
}));

app.use(errorHandler);
function errorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  }

 
var mysqlConnection=mysql.createConnection({
host:'localhost',
user:'root',
password:'',
database:'nodelogin',
multipleStatements:true
});
 
mysqlConnection.connect((error)=>{
if (!error){
console.log('connected to mysql database');
}else{
  console.log('connertion error:',error)
}
});


 app.get("/login", (req, res) => {
     
    res.sendFile(path.join(__dirname + '/pages/login2.html')); 
 });

 app.get("/reg", (req, res) => {
     
    res.sendFile(path.join(__dirname + '/pages/register2.html')); 
 });


 app.post("/auth", (req, res) => {
    var firstname=req.body.firstname;
    var lastname=req.body.lastname; 
   var username=req.body.username;
   var password=req.body.password;
   var hash = bcrypt.hashSync(password, saltRounds);
   data={
       username:username,
       password:hash, // hash password
       firstname:firstname,
       lastname:lastname
   }
   console.log(username,hash);
   // save form data in database 
   mysqlConnection.query("insert into users set ?",data,(error)=>{
       if(!error){
           console.log('A new row has been added to database');
       }else{
           console.log('Error: ',error)
       }
   })

   if (username && password){
       res.redirect('/login');
   }else{
       return res.status(400).json({ message: 'Invalid username or password !' });
   }
 });

app.get("/homepage", (req, res) => {
    res.sendFile(path.join(__dirname + '/pages/home.html'));
});

app.post('/login', (req, res) => {

  // get login data
    logindata={
        username:req.body.username,
     password:req.body.password }
    
     function login(logindta){
        mysqlConnection.query("select * from users where username= ?",logindata.username,(err,rows,fields)=>{
            if (err) {
                console.log('Error',err)
                res.redirect('/login');
            } else {
                var user=rows[0];
                console.log(user);
                // compare 
                bcrypt.compare(logindata.password,user.password,(err,a)=>{
                    if (err) {
                     console.log(err);
                    } 

                    if(user){
                        return res.redirect('/homepage');
                    }
                    
                                 })
            }

        })
    }
    login();
// ----app.get ends here....    
});



app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + '/pages/register2.html'));
});


// listen
 app.listen(3000, () => {
     console.log('App listening on port 3000');
 });