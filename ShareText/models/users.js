const knex = require ("./connect");
const user = {}

user.login = (Username, Password) => {
    return new Promise((resolve,reject) => {
        knex('users').where({Username: Username,Password: Password}).select('*')
        .then(results => {
            if(results.length ==0)
                return reject("Incorrect");
            resolve(results.Username);
        })
        .catch(err => {
            console.log(err);
        });
    });
 };
user.signup = (Username,Password)=>{
    knex('users').insert({Username:Username,Password:Password})
    .then(()=>{
        console.log("Tao acc thanh cong");
    })
    .catch(err =>{
        console.log("Loi tao acc:" +err);
    })
};

module.exports = user;