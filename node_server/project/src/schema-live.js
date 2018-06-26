var graphql = require('graphql');
var knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(user) {
        return user.id;
      }
    },
    username: {
      type: graphql.GraphQLString,
      resolve(user) {
        return user.username;
      }
    },
    isAdmin: {
      type: graphql.GraphQLBoolean,
      resolve(user) {
        return user.role === 'admin';
      }
    },
  }
});

const BookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(book) {
        return book.id;
      }
    }
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(root, args, context) {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(BookType),
      resolve() {
        return knex('book');
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;