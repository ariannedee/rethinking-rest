
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
    .createTable('category', (table) => {
      table.integer('bookId');
      table.integer('userId');
      table.foreign('userId').references('user.id');
      table.foreign('bookId').references('book.id');
      table.string('category');
    })
    .createTable('hasRead', (table) => {
      table.integer('recommendation');
      table.integer('userId');
      table.integer('bookId');
      table.foreign('userId').references('user.id');
      table.foreign('bookId').references('book.id');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('hasRead')
    .dropTable('category')
    .dropTable('book')
    .dropTable('user');
};
