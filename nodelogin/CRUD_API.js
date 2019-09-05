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

 
var mysqlConnection=mysql.createConnection({
host:'localhost',
user:'root',
password:'',
database:'crud_api',
multipleStatements:true
});
 
mysqlConnection.connect((error)=>{
if (!error){
console.log('connected to mysql database');
}else{
  console.log('connection error:',error)
}
});

// get all products

app.get('/products', (req, res) => {
    console.log(req);
    mysqlConnection.query("SELECT * FROM products",(error,rows,fields)=>{
        if(error) throw error;
        res.end(JSON.stringify(rows));
    })
    
});

// get one product
app.get('/products/:id', (req, res) => {
    console.log(req);
    mysqlConnection.query("SELECT * FROM products where id=?",req.body.id,(error,rows,fields)=>{
        if(error) throw error;
        res.end(JSON.stringify(rows));
    })
    
});

// add to products
app.post('/products', (req, res) => {

     newproducts={
         name:req.body.name,
         price:req.body.price,
         quantity:req.body.quantity

     }
    mysqlConnection.query("INSERT INTO products set ?",newproducts,(error,rows,fields)=>{
        if(error) throw error;
        res.end(JSON.stringify(rows));
    })
    
});

// update an existing product 
app.put('/products', (req, res) => {
    
   mysqlConnection.query("UPDATE products SET ?",name=req.body.name,price=req.body.price,quantity=req.body.quantity,(error,rows,fields)=>{
       if(error) throw error;
       res.end(JSON.stringify(rows));
   })
   
});

// delete a product
app.delete('/products/:id', (req, res) => {
    console.log(req);
    mysqlConnection.query("DELETE * FROM products where id=?",req.body.id,(error,rows,fields)=>{
        if(error) throw error;
        res.end(JSON.stringify(rows));
    })
    
});





const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);
