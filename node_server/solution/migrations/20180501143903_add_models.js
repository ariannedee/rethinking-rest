
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('user', (table) => {
      table.integer('id').primary();
      table.string('email').unique();
      table.string('username');
      table.string('password');
      table.string('role');
    })
    .createTable('book', (table) => {
      table.integer('id').primary();
      table.string('title');
      table.string('author');
      table.boolean('fiction');
      table.integer('publishedYear');
    })
    .createTable('hasRead', (table) => {
      table.integer('rating');
      table.integer('userId').notNullable();
      table.integer('bookId').notNullable();
      table.foreign('userId').references('user.id');
      table.foreign('bookId').references('book.id');
      table.unique(['bookId', 'userId'])
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('hasRead')
    .dropTable('book')
    .dropTable('user');
};
