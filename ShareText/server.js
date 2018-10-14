const express = require('express');
const app = express();
const session = require('express-session');
const async = require("async");
const routes = require('./routes')
var http = require('http').Server(app);
var io = require('socket.io')(http);



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
    socket.on('user-connect',UserName =>{
        io.sockets.emit('user-connect',UserName);
        socket.on('disconnect',()=>{
            socket.broadcast.emit('user-disconnect',UserName)
        });
    });
    socket.on('client-send-data', data => {
        io.emit('server-send-data', data);
      });
    socket.on('realtime',value =>{
        socket.broadcast.emit('realtime',value)
    });
})

http.listen(3000,() => {                                         
    console.log("Server listening on port 3000!");
});

