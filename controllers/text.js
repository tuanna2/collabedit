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
        res.redirect("login",{err:"Please login"});
}
controllerData.key= (req,res)=>{
    if(req.session.saveName){
        let view = async () =>{
            let results =await data.view(req.params.key);
            res.render('text',{name:req.session.saveName,value:results[0].text,select:results[0].selected,key:req.params.key})
            
        }
        view();
    }
    else{
        let view = async () =>{
            let results =await data.view(req.params.key);
            res.render('text',{name:'',value:results[0].text,select:results[0].selected,key:req.params.key})
        }
        view();
    }
}
controllerData.update =(req,res) =>{
        const update = async() =>{
            await data.update(req.params.key,req.body.TextArea,req.body.selectLang);
            res.redirect("/key/"+req.params.key);
        }
        update();
}


module.exports = controllerData;