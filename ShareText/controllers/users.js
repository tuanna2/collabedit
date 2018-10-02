const user = require("../models/users");
const data = require("../models/data");
const controllerUser = {};

controllerUser.signup_get = (req,res)=>{
    if(req.session.saveName)
        return res.redirect("/");
    res.render("signup");
};
controllerUser.signup_post = (req,res) =>{
    user.signup(req.body.Username,req.body.Password);
    req.session.saveName = req.body.Username;
    res.redirect("/");
};
controllerUser.login_get = (req,res) =>{
    if(req.session.saveName)
        res.redirect("/");
    else
        res.render("login",{err:""});
}
controllerUser.login_post = (req,res) =>{
    user.login(req.body.Username,req.body.Password).
    then(()=>{
        req.session.saveName=req.body.Username;
            res.redirect("/");}
        ,() => res.render("login", {err: "Incorrect"})
    );
}
controllerUser.signout =(req,res) =>{
    req.session.destroy();
    res.redirect("/");
}
controllerUser.mykey =(req,res) =>{
    if(req.session.saveName){
        const mykey = async() =>{
            let results=await data.keyInUsername(req.session.saveName);
            res.render('profile',{key:results,name:req.session.saveName});
        }
        mykey();    
    }
    else
        res.render("login",{err:"Please login"});
}

module.exports = controllerUser;