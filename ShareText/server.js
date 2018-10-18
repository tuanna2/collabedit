const express = require('express');
const app = express();
const session = require('express-session');
const async = require("async");
const routes = require('./routes')
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(session({
    secret: 'abcxuz',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*60 }
  })) ; 
app.use(express.static("views/display"));
app.set("view engine","ejs"); 
app.set("views","./views"); 
app.use(routes);
io.on('connection',socket =>{
    var users =[];
    socket.on('user-connect',UserName =>{
        io.emit('user-connect',UserName);
        socket.on('disconnect',()=>{
            socket.broadcast.emit('user-disconnect',UserName)
        });
    });
    socket.on('client-send-data', data => {
        io.emit('server-send-data', data);
      });
    socket.on('realtime',value =>{
        io.emit('realtime',value);
    });
    socket.on('langChange',lang=>{
        io.emit('lang',lang);
    });
})

http.listen(3000,() => {                                         
    console.log("Server listening on port 3000!");
});

