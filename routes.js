const controllerHome = require('./controllers/home');
const controllerUser = require("./controllers/users");
const controllerData = require('./controllers/text');
const express = require('express');
const bodyParser =require('body-parser');
const routes = express();
routes.use(bodyParser.urlencoded({ extended: true }));

routes.get('/',controllerHome);

routes.get('/login',controllerUser.login_get);


routes.post('/login',controllerUser.login_post);

routes.get('/signup',controllerUser.signup_get);
routes.post('/signup',controllerUser.signup_post);

routes.get('/profile',controllerData.mykey);
routes.get('/signout',controllerUser.signout);

routes.get('/new',controllerData.new);
routes.get('/key/:key',controllerData.key);
routes.post('/key/:key',controllerData.update);


module.exports = routes;