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
        res.redirect("login");
}
controllerData.key= (req,res)=>{
    let view = async () =>{
        if(req.session.saveName){
                let results =await data.view(req.params.key);
                let admin = await data.selectUsername(req.params.key);
                let permission=(admin[0].Username == req.session.saveName)?0:1;
                res.render('text',{permission:permission,name:req.session.saveName,value:results[0].text,select:results[0].selected,key:req.params.key})
        }
        else{
            let results =await data.view(req.params.key);
            res.render('text',{permission:1,name:'',value:results[0].text,select:results[0].selected,key:req.params.key})
        }
    }
        view().catch(()=>res.redirect('../login'));
    
}
controllerData.update =(req,res) =>{
    if(req.session.saveName){
        const update = async() =>{
            await data.update(req.params.key,req.body.TextArea,req.body.selectLang);
            res.redirect("/key/"+req.params.key);
        }
        update();
    }
}

module.exports = controllerData;