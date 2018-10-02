const express = require('express');
const app = express();
const session = require('express-session');
const async = require("async");
const routes=require('./routes');

app.use(session({
    secret: 'Tuanlatao',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*60 }
  })) ; 
app.use(express.static("views/display"));
app.set("view engine","ejs"); 
app.set("views","./views"); 
app.use(routes);

app.listen(3000,() => {                                         
    console.log("Server runing,port 3000!");
});