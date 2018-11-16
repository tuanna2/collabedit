const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'sql12.freemysqlhosting.net',
      user : 'sql12265721',
      password : 'i6EFIxJfgc',
      database : 'sql12265721'
    }
  });

module.exports = knex;
