const express = require('express');
const app = express();
const session = require('express-session');
const async = require("async");
const routes = require('./routes');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(process.env.PORT || 3000);

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
var active_users =[];
io.on('connection',socket =>{
    // var total=io.engine.clientsCount; // tong so nguoi online
    socket.on('room',key=>{
        socket.join(key);
        socket.on('user-connect',UserName =>{
            active_users.push({"id": socket.id,"UserName":UserName,"key":key});
            // io.in(key).clients((err,clients) => {
            //     console.log(clients); //so nguoi trong room
            // });
            let objRoom =active_users.filter(obj=>{
                return obj.key == key; //return object info room
            });
            io.to(key).emit('user-connect',{UserName:UserName,online:objRoom});
            socket.on('disconnect',()=>{
                active_users.splice(active_users.findIndex(v=>v.id == socket.id),1); //pop user
                let objRoom =active_users.filter(obj=>{
                    return obj.key == key; 
                });
                io.to(key).emit('user-disconnect',{UserName:UserName,online:objRoom});
            });
        });
        //chatbox:
        socket.on('client-send-data', data => {
            io.to(key).emit('server-send-data', data);
          });
        //shareText:
        socket.on('realtime',value =>{
            socket.broadcast.to(key).emit('realtime',value);

        });
        //change language:
        socket.on('langChange',lang=>{
            io.to(key).emit('lang',lang);
        });
        //add :
        socket.on('addCTV',id=>{
            let ctv=active_users.filter(obj=>{
                return obj.id == id;
            });
            io.to(key).emit('addCTV',ctv[0].UserName);
            socket.broadcast.to(id).emit('CTV');
        });
        //build code: 
        socket.on('compiler',data=>io.to(key).emit('compiler',data));
        //call video:
        socket.on('user-calling',obj=>{
            let user =active_users.filter(obj1=>{
                return obj1.id == obj.to;
            });
            socket.broadcast.to(user[0].id).emit('user-calling',obj);
        });
        socket.on('decline',phone=>{
            socket.broadcast.to(phone).emit('decline');
        })
    });
        
})

