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
            let admin = await data.selectUsername(req.params.key);
            let permission=1;
            if (admin[0].Username == req.session.saveName)
                permission=0;
            res.render('text',{permission:permission,name:req.session.saveName,value:results[0].text,select:results[0].selected,key:req.params.key})
            
        }
        view();
    }
    else{
        let view = async () =>{
            let results =await data.view(req.params.key);
            res.render('text',{permission:1,name:'',value:results[0].text,select:results[0].selected,key:req.params.key})
        }
        view();
    }
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