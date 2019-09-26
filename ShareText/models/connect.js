const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'us-cdbr-iron-east-02.cleardb.net',
      user : 'bafe70826c7a37',
      password : 'f59a1590',
      database : 'heroku_4f019047f164d80',
      acquireConnectionTimeout: 10000
    }
  });

module.exports = knex;