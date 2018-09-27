const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'tuanna2',
      password : 'anhtuan',
      database : 'sharetext'
    }
  });

module.exports = knex;