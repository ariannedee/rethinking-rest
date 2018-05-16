var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite",
  },
  migrations: {
    tableName: 'migrations'
  }
});

module.exports = knex;