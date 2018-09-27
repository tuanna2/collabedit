module.exports = (req,res) =>{
    if(req.session.saveName)
        res.render('home',{name:req.session.saveName});
    else
        res.render('home',{name:''});
}