const knex = require ("./connect");
const data = {};

data.newkey= (key,text,Username) => {
    return new Promise((resolve,reject)=>{
        knex(`key`).insert({key:key,text:text,Username:Username})
        .then(()=>{
            resolve();
        })
        .catch(err =>{
            reject("err add key:",err);
        })
    })
}
data.update =(key,text) =>{
    return new Promise((resolve,reject)=>{
    knex(`key`).where(`key`,key).update({text:text})
    .then(()=> resolve())
    .catch(err =>reject("err update",err));
    });
}
data.view = (key) =>{
    return new Promise((resolve,reject) => {
        knex(`key`).where(`key`,key).select('text')
        .then( results => {
            resolve(results);
        })
        .catch(err => {
            reject("Err view data",err);
        });
    });    
}
data.keyInUsername = (Username)=>{
    return new Promise((resolve,reject) => {
        knex(`key`).where(`Username`,Username).select(`key`)
        .then( results => {
            resolve(results);
        })
        .catch(err => {
            reject("Err show key",err);
        });
    });
}

module.exports = data;