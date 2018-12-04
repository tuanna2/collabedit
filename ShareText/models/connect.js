const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '125.212.227.42',
      user : 'root',
      password : 'toor',
      database : 'codecungtroc',
      port:3336
    }
  });

module.exports = knex;
