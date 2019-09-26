const express = require('express');
const app = express();
const session = require('express-session');
const async = require("async");
const routes = require('./routes/routes');
const http = require('http').Server(app);
const io = require('socket.io')(http);
http.listen(3000);
const socket = require('./routes/socket');
const sslRedirect = require('heroku-ssl-redirect');
app.use(sslRedirect());
new socket(io);

app.use(session({
    secret: 'abcxuz',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*60*24*7 }
}));

app.use(express.static("views/display"));
app.set("view engine","ejs"); 
app.set("views","./views"); 
app.use(routes);
