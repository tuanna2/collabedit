const rd = require("randomstring");
const data = require("../models/data");
const controllerData = {};

controllerData.new = (req,res) => {
    if(req.session.saveName){
        const key = rd.generate(5);
        const newkey = async () =>{
            await data.newkey(key,"",req.session.saveName);
            res.redirect("/key/"+key);
        }
        newkey();
    }
    else
        res.render("login",{err:"Please login"});
}
controllerData.key= (req,res)=>{
    if(req.session.saveName){
        const view = async () =>{
            let results =await data.view(req.params.key);
            res.render('text',{name:req.session.saveName,value:results[0].text,key:req.params.key})
        }
        view();
    }
    else
        res.render("login",{err:"Please login"});
}
controllerData.update =(req,res) =>{
    if(req.session.saveName){
        const update = async() =>{
            await data.update(req.params.key,req.body.TextArea);
            res.redirect("/key/"+req.params.key);
        }
        update();
    }
    else
        res.render("login",{err:"Please login"});
}
controllerData.mykey =(req,res) =>{
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

module.exports = controllerData;